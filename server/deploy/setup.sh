#!/usr/bin/env bash
# Разворачивает API в Yandex Cloud: база YDB serverless, таблицы, функция, API Gateway.
# Нужно: yc CLI, авторизованный ключ сервисного аккаунта в $YC_SA_KEY_JSON, каталог $YC_FOLDER_ID.
set -euo pipefail
: "${YC_SA_KEY_JSON:?}" "${YC_FOLDER_ID:?}"
cd "$(dirname "$0")/.."
KEY=$(mktemp); trap 'rm -f "$KEY"' EXIT
printf '%s' "$YC_SA_KEY_JSON" > "$KEY"
yc config profile create zv >/dev/null 2>&1 || true
yc config set service-account-key "$KEY"
yc config set folder-id "$YC_FOLDER_ID"

# Проверка: ключ и каталог (понятные ошибки вместо "Permission denied")
SA_KEY_ID=$(jq -r .service_account_id "$KEY")
echo "Ключ сервисного аккаунта: $(yc iam service-account get "$SA_KEY_ID" --format json 2>/dev/null | jq -r '.name + " (каталог " + .folder_id + ")"' || echo "не удалось прочитать")"
if ! FOLDER=$(yc resource-manager folder get "$YC_FOLDER_ID" --format json 2>/dev/null); then
  echo "::error::YC_FOLDER_ID не найден как каталог или нет доступа. Возможно, туда вписан ID облака, а не каталога."
  exit 1
fi
echo "Каталог: $(jq -r .name <<<"$FOLDER")"
echo "Роли в каталоге:"; yc resource-manager folder list-access-bindings "$YC_FOLDER_ID" --format json | jq -r '.[] | "  " + .role_id + " -> " + .subject.type + ":" + .subject.id'

# 1. База (serverless, регион ru-central1 — данные в РФ)
yc ydb database get zv-db >/dev/null 2>&1 || yc ydb database create zv-db --serverless
DOCAPI=$(yc ydb database get zv-db --format json | jq -r .document_api_endpoint)

# 2. Сервисный аккаунт функции и статический ключ для Document API
yc iam service-account get zv-api >/dev/null 2>&1 || yc iam service-account create zv-api
SA=$(yc iam service-account get zv-api --format json | jq -r .id)
yc resource-manager folder add-access-binding "$YC_FOLDER_ID" --role ydb.editor --subject serviceAccount:"$SA" >/dev/null || true
yc resource-manager folder add-access-binding "$YC_FOLDER_ID" --role lockbox.payloadViewer --subject serviceAccount:"$SA" >/dev/null || true
# Статический ключ для Document API создаётся один раз и хранится только в Lockbox (в логи не выводится).
if ! yc lockbox secret get zv-ydb-key >/dev/null 2>&1; then
  K=$(yc iam access-key create --service-account-name zv-api --format json)
  jq -n --argjson k "$K" '[{key:"YDB_ACCESS_KEY_ID",text_value:$k.access_key.key_id},{key:"YDB_SECRET_ACCESS_KEY",text_value:$k.secret}]' > /tmp/zv-payload.json
  yc lockbox secret create --name zv-ydb-key --payload "$(cat /tmp/zv-payload.json)" >/dev/null
  rm -f /tmp/zv-payload.json
fi
SECRET_ID=$(yc lockbox secret get zv-ydb-key --format json | jq -r .id)
SECRET_VER=$(yc lockbox secret get zv-ydb-key --format json | jq -r .current_version.id)
P=$(yc lockbox payload get --id "$SECRET_ID" --format json)
export YDB_ACCESS_KEY_ID=$(jq -r '.entries[]|select(.key=="YDB_ACCESS_KEY_ID").text_value' <<<"$P")
export YDB_SECRET_ACCESS_KEY=$(jq -r '.entries[]|select(.key=="YDB_SECRET_ACCESS_KEY").text_value' <<<"$P")
[ -n "${GITHUB_ACTIONS:-}" ] && echo "::add-mask::$YDB_SECRET_ACCESS_KEY" && echo "::add-mask::$YDB_ACCESS_KEY_ID"

# 3. Таблицы (Document API, совместим с DynamoDB)
YDB_DOCAPI_ENDPOINT="$DOCAPI" node deploy/create-tables.js

# 4. Функция
rm -rf /tmp/zv-build && mkdir /tmp/zv-build && cp -r src package.json /tmp/zv-build/  # зависимости ставит облако по package.json
yc serverless function get zv-api >/dev/null 2>&1 || yc serverless function create zv-api
yc serverless function version create --function-name zv-api --runtime nodejs22 --entrypoint src/index.handler \
  --memory 256m --execution-timeout 10s --source-path /tmp/zv-build --service-account-id "$SA" \
  --environment "YDB_DOCAPI_ENDPOINT=$DOCAPI,ALLOWED_ORIGINS=https://aleksarulezzz.ru" \
  --secret "id=$SECRET_ID,version-id=$SECRET_VER,key=YDB_ACCESS_KEY_ID,environment-variable=YDB_ACCESS_KEY_ID" \
  --secret "id=$SECRET_ID,version-id=$SECRET_VER,key=YDB_SECRET_ACCESS_KEY,environment-variable=YDB_SECRET_ACCESS_KEY"
FID=$(yc serverless function get zv-api --format json | jq -r .id)

# 5. API Gateway: всё /api/* -> функция
yc iam service-account get zv-gw >/dev/null 2>&1 || yc iam service-account create zv-gw
GWSA=$(yc iam service-account get zv-gw --format json | jq -r .id)
yc resource-manager folder add-access-binding "$YC_FOLDER_ID" --role functions.functionInvoker --subject serviceAccount:"$GWSA" >/dev/null || true
sed "s/__FUNCTION_ID__/$FID/; s/__SA_ID__/$GWSA/" deploy/gateway.yaml > /tmp/zv-gw.yaml
if yc serverless api-gateway get zv-gw >/dev/null 2>&1; then
  yc serverless api-gateway update zv-gw --spec /tmp/zv-gw.yaml
else
  yc serverless api-gateway create zv-gw --spec /tmp/zv-gw.yaml
fi
echo "Готово. Адрес API: https://$(yc serverless api-gateway get zv-gw --format json | jq -r .domain)/api/health"
