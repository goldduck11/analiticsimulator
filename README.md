# Analitic Simulator

Тренажёр для аналитиков данных: прохождение заданий, начисление баллов, отслеживание прогресса.

**Стек:** Java 17, Quarkus, PostgreSQL, JWT, Docker

**Структура:**
- `server/` – бэкенд-сервис на Quarkus (REST API, бизнес-логика, БД)
- `client/` – фронтенд на Next.js

## Быстрый запуск

#### Требуется Docker и Docker Compose
```bash
cd server
docker compose up --build
```

После запуска:
- Backend: http://localhost:8080
- Swagger UI (документация API): http://localhost:8080/q/swagger-ui
- Frontend: http://localhost:3000

## Подробная документация API и примеры запросов

Смотрите [server/README.md](server/README.md) – там указаны эндпоинты, curl-команды.
