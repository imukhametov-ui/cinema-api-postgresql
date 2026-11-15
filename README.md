# Cinema Booking API — Homework 2

REST API для керування фільмами, кінозалами, сеансами та бронюванням місць.

Проєкт розроблений на **NestJS, TypeScript, PostgreSQL і TypeORM**.

## Технології

- Node.js / NestJS
- TypeScript
- PostgreSQL 18
- TypeORM
- Docker Compose
- Swagger / OpenAPI
- Jest

## Основні можливості

- CRUD-операції для фільмів.
- Створення та перегляд кінозалів.
- Створення та перегляд кіносеансів.
- Фільтрація сеансів за фільмом і датою.
- Пагінація та сортування через PostgreSQL.
- Бронювання місць із використанням транзакцій.
- Захист від подвійного бронювання (HTTP 409).
- Звільнення місць після видалення бронювання.
- Єдиний формат HTTP-помилок.
- Міграції бази даних і тестові дані (seed).

## Встановлення

Потрібні Node.js, npm і Docker Desktop.

```bash
git clone https://github.com/imukhametov-ui/cinema-api-postgresql.git
cd cinema-api-postgresql
npm install
```

## Налаштування середовища

Створіть `.env` на основі `.env.example`.

Приклад для локального Docker Compose:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=cinema_user
DB_PASSWORD=cinema_password
DB_DATABASE=cinema_db
```

Пароль наведено для локального навчального середовища. Не використовуйте його у production.

## Запуск PostgreSQL

```bash
docker compose up -d
```

PostgreSQL працює на порту `5433` хост-комп'ютера.

## Міграції

Створення таблиць:

```bash
npm run migration:run
```

Перевірка стану:

```bash
npm run migration:show
```

Відкат останньої міграції:

```bash
npm run migration:revert
```

**Увага:** відкат початкової міграції видаляє таблиці та їхні дані. Використовуйте його лише в тестовому середовищі.

## Тестові дані

```bash
npm run seed
```

Seed створює демонстраційні фільми, кінозали, сеанси та бронювання. Повторний послідовний запуск не повинен дублювати вже створені записи.

## Запуск API

```bash
npm run start:dev
```

API: http://localhost:3000

Swagger: http://localhost:3000/docs

## Основні маршрути

| Метод | Маршрут | Опис |
|---|---|---|
| GET | `/films` | Список фільмів |
| POST | `/films` | Створення фільму |
| GET | `/halls` | Список залів |
| POST | `/halls` | Створення залу |
| GET | `/showings` | Список сеансів |
| POST | `/showings` | Створення сеансу |
| GET | `/showings/:id` | Деталі сеансу |
| GET | `/showings/:id/seats` | Стан місць |
| POST | `/showings/:id/bookings` | Бронювання місць |
| GET | `/showings/:id/bookings` | Бронювання сеансу |
| GET | `/bookings` | Список бронювань |
| DELETE | `/bookings/:id` | Видалення бронювання |

Повний опис маршрутів і параметрів доступний у Swagger.

### Приклад пагінації та сортування

```http
GET /showings?page=1&limit=2&sort=asc
```

Відповідь містить поля `items`, `total`, `page`, `limit`.

## Обробка помилок

Глобальний ExceptionFilter повертає помилки в єдиному форматі:

```json
{
  "statusCode": 404,
  "message": "Showing not found",
  "timestamp": "2026-11-15T21:03:17.739Z",
  "path": "/showings/invalid-id"
}
```

## Перевірка проєкту

```bash
npm run build
npm test -- --runInBand
```

## Репозиторій

https://github.com/imukhametov-ui/cinema-api-postgresql
