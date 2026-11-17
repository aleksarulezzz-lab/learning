# API личных кабинетов «Звездочёт»

Сервер для регистрации родителей, профилей детей, синхронизации прогресса и пробного периода.
Работает в Yandex Cloud (Cloud Functions + YDB serverless, регион ru-central1), чтобы данные
пользователей хранились в России (152-ФЗ, ст. 18 ч. 5). Сайт остаётся на GitHub Pages и ходит в API
по адресу API Gateway (позже — api.aleksarulezzz.ru).

## Что умеет

| Метод | Путь | Что делает |
| --- | --- | --- |
| POST | /api/register | Регистрация. Обязательны `adult`, `consentPd`, `acceptOffer` = true; пишет журнал согласий |
| POST | /api/login, /api/logout | Вход и выход (токен в `Authorization: Bearer`) |
| GET | /api/me | Пользователь, доступ (trial / paid / expired), профили детей |
| POST, PUT, DELETE | /api/children[/:id] | Профили детей: никнейм, класс, аватар — без имён и фото |
| GET, PUT | /api/progress/:childId[/:subject] | Прогресс по предметам math, zh, en, hub |
| GET | /api/me/export | Выгрузка всех своих данных |
| DELETE | /api/me | Удаление аккаунта (с паролем) |
| POST | /api/consent/revoke | Отзыв согласия = удаление данных |

Пароли — scrypt, после 10 неверных попыток вход блокируется на 15 минут. CORS открыт только для
https://aleksarulezzz.ru. Пробный период — 14 дней с регистрации, цена 350 ₽ записывается в профиль
(«цена первых»). Оплата (ЮKassa) и письма (подтверждение почты, сброс пароля) — следующие шаги.

## Тесты

```
cd server && npm test
```

## Развёртывание

Нужны `yc` CLI, `jq`, переменные `YC_SA_KEY_JSON` (авторизованный ключ сервисного аккаунта с ролью
`editor` на каталог) и `YC_FOLDER_ID`. Затем `npm install && ./deploy/setup.sh`.
