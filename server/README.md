# Analitic Simulator Server (Quarkus)

Backend migrated from Spring Boot to Quarkus.

## Stack

- Quarkus REST (JAX-RS)
- Quarkus Arc (CDI)
- Hibernate ORM + Panache
- PostgreSQL
- Bean Validation
- SmallRye OpenAPI / Swagger UI

## Run

1. Start PostgreSQL (for example with `compose.yaml`).
2. Set env vars if needed:
   - `DB_URL` (default: `jdbc:postgresql://localhost:5432/mydatabase`)
   - `DB_USERNAME` (default: `myuser`)
   - `DB_PASSWORD` (default: `secret`)
3. Run app:
   - `./mvnw quarkus:dev`

## Security model

- Public endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
- Protected endpoints:
  - `/api/*` (except public ones)
- HTTP Basic auth is enabled and validated against `users` table.

## API docs

- OpenAPI: `/q/openapi`
- Swagger UI: `/q/swagger-ui`


---


## Тестирование API

### Регистрация

```
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","email":"ivan@test.com","username":"ivan","password":"123456"}'
```

### Логин (получение JWT токена)

```
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"ivan@test.com","password":"123456"}'
```

**Сохраните полученный токен.**

### Получить все задания с прогрессом пользователя

```
curl -X GET http://localhost:8080/api/tasks/tasks \
  -H "Authorization: Bearer <токен>"
```

### Получить конкретное задание

```
curl -X GET http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer <токен>"
```

### Отправить ответ на задание (например, задание 1)

```
curl -X POST http://localhost:8080/api/tasks/submit/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <токен>" \
  -d '{"answer":"SELECT * FROM users;"}'
```
### Отправить ответ на задание по id

```bash
curl -X POST http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <токен>" \
  -d '{"answer":"SELECT * FROM users;"}'

### Личный кабинет (прогресс) 

```
curl -X GET http://localhost:8080/api/tasks/tasks \
  -H "Authorization: Bearer <токен>"
```
