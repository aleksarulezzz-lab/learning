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

# 1. База (serverless, регион ru-central1 — данные в РФ)
yc ydb database get zv-db >/dev/null 2>&1 || yc ydb database create zv-db --serverless
DOCAPI=$(yc ydb database get zv-db --format json | jq -r .document_api_endpoint)

# 2. Сервисный аккаунт функции и статический ключ для Document API
yc iam service-account get zv-api >/dev/null 2>&1 || yc iam service-account create zv-api
SA=$(yc iam service-account get zv-api --format json | jq -r .id)
yc resource-manager folder add-access-binding "$YC_FOLDER_ID" --role ydb.editor --subject serviceAccount:"$SA" >/dev/null || true
if [ -z "${YDB_ACCESS_KEY_ID:-}" ]; then
  K=$(yc iam access-key create --service-account-name zv-api --format json)
  YDB_ACCESS_KEY_ID=$(jq -r .access_key.key_id <<<"$K"); YDB_SECRET_ACCESS_KEY=$(jq -r .secret <<<"$K")
  echo "Сохраните YDB_ACCESS_KEY_ID и YDB_SECRET_ACCESS_KEY в Lockbox/секретах окружения (выводятся один раз)."
fi

# 3. Таблицы (Document API, совместим с DynamoDB) — создаёт node-скрипт
YDB_DOCAPI_ENDPOINT="$DOCAPI" YDB_ACCESS_KEY_ID="$YDB_ACCESS_KEY_ID" YDB_SECRET_ACCESS_KEY="$YDB_SECRET_ACCESS_KEY" \
  node deploy/create-tables.js

# 4. Функция
rm -rf /tmp/zv-build && mkdir /tmp/zv-build && cp -r src package.json /tmp/zv-build/
yc serverless function get zv-api >/dev/null 2>&1 || yc serverless function create zv-api
yc serverless function version create --function-name zv-api --runtime nodejs22 --entrypoint src/index.handler \
  --memory 256m --execution-timeout 10s --source-path /tmp/zv-build --service-account-id "$SA" \
  --environment "YDB_DOCAPI_ENDPOINT=$DOCAPI,YDB_ACCESS_KEY_ID=$YDB_ACCESS_KEY_ID,YDB_SECRET_ACCESS_KEY=$YDB_SECRET_ACCESS_KEY,ALLOWED_ORIGINS=https://aleksarulezzz.ru"
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
