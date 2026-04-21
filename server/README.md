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
