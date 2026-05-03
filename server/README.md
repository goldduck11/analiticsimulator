````markdown
# 🚀 Analitic Simulator Server (Quarkus)

> **Название проекта:** `analiticsimulator/server`  
> **Тип:** Quarkus 3.15.3 + Java 17 + PostgreSQL  
> **Описание:** Backend для тренажёра аналитиков данных. Обеспечивает аутентификацию, управление заданиями, оценку ответов и хранение прогресса пользователя.

---

## 🧩 Общая архитектура

```
Клиент (Next.js)
    ↓ HTTPS
Сервер (Quarkus)
    ↓ JDBC
PostgreSQL (Хранение: пользователи, задания, прогресс)
```

### 🔗 Принципы проектирования
- **Микросервисная архитектура** — приложение автономно.
- **Reactive-first подход** — Quarkus поддерживает как imperative, так и reactive стили.
- **DevOps-ready** — поддержка Docker, Kubernetes, Prometheus.
- **Безопасность по умолчанию** — JWT, CORS, валидация.

---

## 🔌 Технологический стек

| Компонент | Назначение | Версия |
|---------|----------|--------|
| **Quarkus** | Модернизированный Java-фреймворк для GraalVM и контейнеров | 3.15.3 |
| **Java 17** | Язык программирования | LTS |
| **JAX-RS** | Создание REST API | Jakarta EE 10 |
| **CDI (Arc)** | Управление зависимостями (DI) | Quarkus Arc |
| **Hibernate ORM + Panache** | Работа с БД, JPA | Встроен в Quarkus |
| **PostgreSQL** | Реляционная база данных | 15+ |
| **SmallRye OpenAPI / Swagger UI** | Документация API | Встроен |
| **Bean Validation** | Валидация DTO | Jakarta Bean Validation 3.0 |
| **SmallRye JWT** | Генерация и проверка JWT | RSA 256 |
| **Lombok** | Снижение boilerplate кода | 1.18.32 |
| **Maven** | Сборка проекта | 3.9.6 |

---

## 📦 Зависимости (pom.xml)

### Основные модули Quarkus

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-arc</artifactId>
</dependency>
```
- **CDI (Contexts and Dependency Injection)** через `Arc` — легковесный DI-контейнер.

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-rest-jackson</artifactId>
</dependency>
```
- REST API на основе **JAX-RS + Jackson** — автоматическая сериализация/десериализация JSON.

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-hibernate-orm-panache</artifactId>
</dependency>
```
- **Panache** — упрощённый API для Hibernate:
  ```java
  List<Task> tasks = taskRepository.listAll();
  Task task = taskRepository.findById(id);
  ```

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-jdbc-postgresql</artifactId>
</dependency>
```
- Подключение к PostgreSQL через JDBC.

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-hibernate-validator</artifactId>
</dependency>
```
- Валидация DTO:
  ```java
  @NotBlank @Email String email;
  ```

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-smallrye-openapi</artifactId>
</dependency>
```
- Автоматическая генерация OpenAPI-спецификации.

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-security</artifactId>
</dependency>
```
- Аутентификация и авторизация.

```xml
<dependency>
    <groupId>org.mindrot</groupId>
    <artifactId>jbcrypt</artifactId>
    <version>0.4</version>
</dependency>
```
- Хеширование паролей.

---

## ⚙️ Конфигурация (`application.properties`)

### Подключение к БД
```properties
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=${DB_USERNAME:myuser}
quarkus.datasource.password=${DB_PASSWORD:secret}
quarkus.datasource.jdbc.url=${DB_URL:jdbc:postgresql://localhost:5432/mydatabase}
```
- Поддержка переменных окружения.
- Можно переопределить через `.env`.

### Управление схемой БД
```properties
quarkus.hibernate-orm.database.generation=drop-and-create
quarkus.hibernate-orm.sql-load-script=data.sql
```
- При старте:
  - Удаляет старую схему
  - Создаёт новую
  - Загружает тестовые данные из `data.sql`

> ✅ Отлично для разработки.  
> ❌ Не использовать в продакшене.

### Безопасность (JWT)
```properties
smallrye.jwt.sign.key.location=privateKeyPkcs8.pem
mp.jwt.verify.publickey.location=publicKey.pem
mp.jwt.verify.issuer=https://my-app.com
auth.jwt.expiry-seconds=3600
```
- Подпись JWT через **RSA-256**.
- Публичный ключ — для проверки токена.
- Срок действия — 1 час.

### CORS
```properties
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:3000
quarkus.http.cors.methods=GET,POST,PUT,DELETE,OPTIONS
quarkus.http.cors.headers=Content-Type,Authorization
```
- Разрешён доступ с клиента (`localhost:3000`).
- Защита от CSRF через `SameSite` (на клиенте).

### Авторизация
```properties
quarkus.http.auth.permission.public.paths=/api/auth/*,/q/openapi,/q/swagger-ui/*
quarkus.http.auth.permission.secured.policy=authenticated
```
- Только `/api/auth/*` доступен без токена.
- Все остальные эндпоинты требуют JWT.

---

## 🗂️ Структура проекта

```
src/main/java/ru/courseproject/analiticsimulator/
├── auth/
│   ├── controller/     → AuthController (login, register)
│   ├── service/        → AuthService (логика аутентификации)
│   └── dto/            → LoginRequest, RegisterRequest, LoginResponse
├── task/
│   ├── controller/     → TaskController (/tasks, /submit)
│   ├── service/        → TaskService (бизнес-логика)
│   ├── repository/     → TaskRepository (Panache)
│   ├── model/          → Task, Topic
│   └── enums/          → TaskType, ComplexityType
├── user/
│   ├── account/        → User, UserRepository, UserService
│   └── progress/       → UserProgress, UserProgressService
├── dto/                → Все DTO (TaskDto, SubmissionResult и др.)
└── Application.java    → Точка входа
```

---

## 🔐 Модель безопасности

### 1. **Аутентификация**
- `POST /api/auth/login` → возвращает JWT.
- `POST /api/auth/register` → создаёт пользователя с хешированием BCrypt.

### 2. **Авторизация**
- Все эндпоинты, кроме `/api/auth/*`, защищены:
  ```java
  @Authenticated
  ```
- JWT проверяется через публичный ключ.

### 3. **HTTP Basic Auth (заглушка)**
```properties
quarkus.http.auth.basic=true
```
- Используется только для демонстрации.
- В реальности — только JWT.

---

## 📡 API Endpoints

| Метод | Путь | Описание |
|------|------|--------|
| `POST` | `/api/auth/login` | Вход |
| `POST` | `/api/auth/register` | Регистрация |
| `GET` | `/api/tasks` | Список заданий |
| `GET` | `/api/tasks/{id}` | Полное задание |
| `POST` | `/api/tasks/{id}/submit` | Отправка ответа |
| `GET` | `/api/user/progress` | Прогресс пользователя |
| `GET` | `/api/results/{id}` | Результат попытки |
| `GET` | `/api/tasks/topics` | Темы заданий |

---

## 📄 Документация API

### OpenAPI
- Доступно по: `http://localhost:8080/q/openapi`
- Формат: YAML

### Swagger UI
- Интерактивная документация: `http://localhost:8080/q/swagger-ui`
- Можно тестировать эндпоинты прямо в браузере.

---

## 🛠️ Запуск и разработка

### 1. Запустите PostgreSQL
```bash
docker-compose up db
```

Или вручную:
```bash
docker run -d --name postgres \
  -e POSTGRES_DB=analiticsimulator \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:15
```

### 2. Установите переменные окружения (опционально)
```bash
export DB_URL=jdbc:postgresql://localhost:5432/analiticsimulator
export DB_USERNAME=myuser
export DB_PASSWORD=secret
```

### 3. Запустите сервер
```bash
./mvnw quarkus:dev
```
- Режим разработки: горячая перезагрузка.
- Сервер доступен на `http://localhost:8080`

---

## 🐳 Контейнеризация (Docker)

### `Dockerfile`
```dockerfile
# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre
COPY --from=build /build/target/quarkus-app/ /deployments/
CMD ["java", "-jar", "/deployments/quarkus-run.jar"]
```

### Сборка образа
```bash
docker build -t analiticsimulator/server .
```

### Запуск
```bash
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/analiticsimulator \
  analiticsimulator/server
```

---

## 🔄 Интеграция с клиентом

| Клиент | Сервер | Статус |
|-------|--------|-------|
| `useAuthStore` | `/api/auth/login` | ✅ Работает |
| `useTaskStore.fetchTasks()` | `/api/tasks` | ✅ |
| `useTaskStore.fetchTask()` | `/api/tasks/{id}` | ⚠️ Нет `questions` |
| `useTaskStore.submitTask()` | `/api/tasks/{id}/submit` | ✅ |
| `useProgressStore.fetchProgress()` | `/api/user/progress` | ⚠️ `totalTasks` — хардкод |

