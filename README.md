# 📄 Технический отчёт: Analyst Trainer — Бэкенд-сервис для тренажёра аналитиков

> **Проект:** `analiticsimulator`  
> **Технологии:** Quarkus, Java 17, PostgreSQL, Docker  
> **Ссылка на репозиторий:** [github.com/keyproject/analiticsimulator](https://github.com/keyproject/analiticsimulator)

---

## 🎯 Цель проекта

Разработать **бэкенд-сервис веб-приложения-тренажёра**, позволяющего аналитикам отрабатывать практические навыки в безопасной и контролируемой среде. Сервис должен имитировать реальную работу аналитика: прохождение заданий, фиксация результатов, начисление баллов и ведение прогресса.

---

## ✅ Реализованные функции

| Функция | Статус | Описание |
|--------|-------|--------|
| **Регистрация и аутентификация** | ✅ | JWT + BCrypt, защита эндпоинтов |
| **Просмотр списка заданий** | ✅ | `/api/tasks` — все доступные тренажёры |
| **Прохождение заданий (3 типа)** | ✅ | TEST, ERROR_DETECTION, PRACTICE |
| **Фиксация результатов** | ✅ | Сохранение ответов, оценка, дата завершения |
| **Начисление баллов** | ✅ | По единым правилам: 0 или 100 баллов за задание |
| **Прогресс пользователя** | ✅ | Личный кабинет: общий счёт, история попыток |
| **Docker-развёртывание** | ✅ | `docker-compose.yml` для всей системы |
| **REST API** | ✅ | Полностью покрывает сценарии |
| **Автоматическая проверка** | ✅+ | Поддержка всех типов заданий |

> 💬 **Дополнительная функциональность (за +10 баллов):**
> - Автоматическая проверка ответов для всех типов заданий.
> - Поддержка ключевых слов для открытых заданий.
> - Полноценная модель данных с сохранением истории.

---

## 🧩 Архитектура решения

### Общая схема
```
Клиент (Next.js) ← HTTPS → Сервер (Quarkus) ← JDBC → PostgreSQL
       ↑                             ↑                    ↑
   Docker (опционально)        Docker (опционально)    Docker
```

### Принципы проектирования
- **Clean Architecture**: `controller → service → repository → entity`
- **Без Spring**: использован Quarkus как альтернатива
- **Безопасность по умолчанию**: JWT, CORS, валидация
- **DevOps-ready**: поддержка Docker, CI/CD

---

## 🔌 Технологический стек

| Компонент | Технология | Версия | Назначение |
|---------|-----------|--------|----------|
| **Фреймворк** | Quarkus | 3.15.3 | Java-фреймворк без Spring |
| **Язык** | Java | 17 | LTS, record'ы, sealed классы |
| **REST API** | JAX-RS | Jakarta EE 10 | Эндпоинты |
| **ORM** | Hibernate ORM + Panache | Встроен | Работа с БД |
| **DI** | CDI (Arc) | - | Управление зависимостями |
| **Безопасность** | SmallRye JWT | - | Генерация и проверка токенов |
| **Валидация** | Jakarta Bean Validation | 3.0 | `@NotBlank`, `@Email` |
| **Хеширование** | jBCrypt | 0.4 | Хранение паролей |
| **База данных** | PostgreSQL | 16 | Надёжное хранение данных |
| **Контейнеризация** | Docker + docker-compose | - | Запуск системы |
| **Документация** | OpenAPI / Swagger UI | - | Авто-генерация |

---

## 🗄️ Модель данных

### Сущности

#### `users`
| Поле | Тип | Описание |
|------|-----|--------|
| `id` | BIGINT PK | Идентификатор |
| `name` | VARCHAR | Имя пользователя |
| `email` | VARCHAR UNIQUE | Email |
| `username` | VARCHAR UNIQUE | Логин |
| `password` | VARCHAR | Хеш пароля |
| `role` | VARCHAR | "USER" |

#### `topics`
| Поле | Тип | Описание |
|------|-----|--------|
| `id` | BIGINT PK | Идентификатор |
| `name` | VARCHAR | Тема задания (SQL, метрики и т.д.) |

#### `tasks`
| Поле | Тип | Описание |
|------|-----|--------|
| `id` | BIGINT PK | Идентификатор |
| `question` | TEXT | Формулировка задания |
| `answer` | TEXT | Правильный ответ |
| `tasktype` | INT (enum) | Тип: TEST, ERROR_DETECTION, PRACTICE |
| `complexity` | INT (enum) | Сложность: EASY, MEDIUM, HARD |
| `topic_id` | BIGINT FK | Связь с темой |
| `hint` | TEXT | Подсказка |
| `max_score` | INT | Максимальный балл (по умолчанию 100) |
| `expected_keywords` | TEXT | Ключевые слова для PRACTICE |

#### `user_progress`
| Поле | Тип | Описание |
|------|-----|--------|
| `id` | BIGINT PK | Идентификатор |
| `user_id` | BIGINT FK | Ссылка на пользователя |
| `task_id` | BIGINT FK | Ссылка на задание |
| `user_answer` | TEXT | Ответ пользователя |
| `completed` | BOOLEAN | Выполнено ли задание |
| `score` | INT | Набранные баллы |
| `completed_at` | TIMESTAMP | Дата завершения |
| `submission_id` | VARCHAR UNIQUE | ID попытки (например, `sub_1714752000`) |

---

## 📡 REST API

| Метод | Путь | Описание |
|------|------|--------|
| `POST` | `/api/auth/login` | Аутентификация |
| `POST` | `/api/auth/register` | Регистрация |
| `GET` | `/api/tasks` | Список всех заданий |
| `GET` | `/api/tasks/{id}` | Детали задания |
| `POST` | `/api/tasks/{id}/submit` | Отправка ответа |
| `GET` | `/api/user/progress` | Прогресс пользователя |
| `GET` | `/api/results/{id}` | Результат конкретной попытки |
| `GET` | `/api/tasks/topics` | Темы заданий |

> ✅ Все эндпоинты защищены через `@Authenticated`, кроме `/api/auth/*`.

---

## 🔐 Безопасность

- **Аутентификация**: JWT (RSA 256), подпись приватным ключом.
- **Хранение паролей**: BCrypt (salt 12).
- **CORS**: разрешён только `http://localhost:3000`.
- **Авторизация**: только авторизованные пользователи могут проходить задания.
- **JWT срок действия**: 1 час.

---

## 🔄 Бизнес-логика

### Начисление баллов
| Тип задания | Правило |
|------------|--------|
| **TEST** | Полное совпадение выбранного варианта с `answer` → 100 баллов |
| **ERROR_DETECTION** | Совпадение найденной ошибки с `answer` → 100 баллов |
| **PRACTICE** | Наличие хотя бы одного из `expected_keywords` в ответе → 100 баллов |

> ✅ Баллы начисляются **объективно**, без участия модератора.

### Прогресс пользователя
- Общий счёт: сумма всех `score`.
- Выполненные задания: количество `completed = true`.
- История: список попыток с датой, баллами, типом задания.

---

## 🐳 Запуск приложения

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/keyproject/analiticsimulator.git
cd analiticsimulator
```

### 2. Запустите через Docker
```bash
docker-compose up --build
```

### 3. Приложение доступно:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/q/swagger-ui`

---

## 📦 Docker-конфигурация

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: mydatabase
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    ports:
      - "8080:8080"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:postgresql://postgres:5432/mydatabase
      QUARKUS_DATASOURCE_USERNAME: myuser
      QUARKUS_DATASOURCE_PASSWORD: secret
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./server/privateKeyPkcs8.pem:/deployments/privateKeyPkcs8.pem

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 🧪 Демонстрация сценариев

### 1. Регистрация и вход
- Перейдите на `http://localhost:3000/register`
- Заполните форму → автоматический вход
- Токен сохраняется в `localStorage`

### 2. Прохождение заданий
- На главной странице — список заданий
- Выберите задание → ответьте на вопросы
- После отправки — мгновенная оценка

### 3. Личный кабинет
- Раздел "Прогресс" → общий счёт, история попыток
- Можно пересдать задание (баллы обновляются)

---

## 📝 Заключение

### Что сделано:
- ✅ Полностью реализован бэкенд-сервис без Spring.
- ✅ Поддержка всех трёх типов заданий с автоматической проверкой.
- ✅ Начисление баллов и ведение прогресса.
- ✅ Docker-развёртывание всей системы.
- ✅ REST API с документацией.
- ✅ Интерфейс (клиент на Next.js) — **дополнительные баллы**.

### Преимущества решения:
- **Масштабируемость**: легко добавить новые типы заданий.
- **Безопасность**: JWT, BCrypt, CORS.
- **Готовность к продакшену**: контейнеризация, логирование, документация.
- **Образовательная ценность**: реалистичные задания по SQL, метрикам, A/B-тестам.

---

## 📎 Приложения

1. [Ссылка на GitHub](https://github.com/keyproject/analiticsimulator)
2. [Инструкция по запуску (README.md)](https://github.com/keyproject/analiticsimulator/blob/main/README.md)
3. [OpenAPI спецификация](http://localhost:8080/q/openapi)
4. [Swagger UI](http://localhost:8080/q/swagger-ui)

