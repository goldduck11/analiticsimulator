````markdown
# 📄 Клиентское приложение: Analyst Trainer

> **Название проекта:** `analiticsimulator/client`  
> **Путь:** `C:\Users\Admin\IdeaProjects\analiticsimulator\client`  
> **Тип:** Next.js 16 (App Router) + TypeScript + Tailwind CSS  
> **Описание:** Интерактивный тренажёр для аналитиков данных. Включает задания по SQL, A/B-тестам, метрикам, воронкам и интерпретации данных.

---

## 🧭 Обзор

Клиентская часть представляет собой полноценное **React-приложение на базе Next.js**, ориентированное на обучение и самопроверку навыков аналитики. Приложение использует современные практики разработки:

- Полная типизация через **TypeScript**
- Управление состоянием через **Zustand**
- Формы с валидацией через **react-hook-form + Zod**
- UI-компоненты на основе **shadcn/ui** и **Radix UI**
- Темизация через **OKLCH-цвета**
- Поддержка светлой и тёмной темы

---

## 🗂️ Структура проекта

```bash
client/
├── .idea/                  # Конфигурация IDE (IntelliJ/WebStorm)
├── app/                    # App Router (Next.js)
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── tasks/[id]/
│   ├── results/[submissionId]/
│   ├── layout.tsx
│   ├── page.tsx            # Главная страница
│   └── ...
├── components/             # Компоненты приложения
│   ├── layout/             # Header, AuthGuard
│   ├── tasks/              # TestTask, ErrorFindTask, OpenTask, TaskList
│   ├── dashboard/          # StatsCard, ProgressChart, HistoryTable
│   └── ui/                 # Примитивы (Button, Card, Field, Input и др.)
├── lib/                    # Вспомогательные утилиты
│   ├── api/                # API-клиент и адаптеры
│   │   ├── client.ts       # HTTP-запросы
│   │   └── adapter.ts      # Маппинг DTO → доменная модель
│   ├── stores/             # Zustand-сторы
│   │   ├── auth-store.ts
│   │   ├── task-store.ts
│   │   └── progress-store.ts
│   └── utils/
│       ├── cn.ts           # Утилита для объединения классов
│       └── formatters.ts   # Форматирование дат, сложности, цветов
├── store/                  # Экспорт всех сторов (index.ts)
├── styles/                 # Глобальные стили
│   └── globals.css         # Tailwind + OKLCH + темизация
├── types/                  # TypeScript-типы
│   └── index.ts            # Все интерфейсы и enum'ы
├── .env.local              # Переменные окружения
├── .gitignore              # Игнорируемые файлы
├── .prettierrc             # Настройки форматирования
├── next.config.js          # Конфигурация Next.js
├── tsconfig.json           # Конфигурация TypeScript
├── package.json            # Зависимости и скрипты
├── yarn.lock               # Версии пакетов
├── Dockerfile              # Контейнеризация клиента
└── postcss.config.mjs      # Конфигурация PostCSS
```

---

## 🔌 Основные технологии

| Технология | Назначение |
|----------|----------|
| **Next.js 16** | Серверные компоненты, роутинг, метаданные |
| **React 19** | UI-библиотека |
| **TypeScript** | Типизация всего кода |
| **Tailwind CSS** | Утилитарные классы |
| **OKLCH** | Цветовое пространство для точной передачи цветов |
| **Zustand** | Управление глобальным состоянием |
| **Zod** | Валидация форм и API-ответов |
| **react-hook-form** | Управление формами |
| **shadcn/ui** | Дизайн-система на базе Radix UI |
| **Recharts** | Графики прогресса |
| **Lucide React** | Иконки |

---

## 🛠️ Зависимости (package.json)

### Основные
```json
"dependencies": {
  "next": "16.2.0",
  "react": "^19",
  "react-dom": "^19",
  "zustand": "^5.0.12",
  "zod": "^3.24.1",
  "react-hook-form": "^7.54.1",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^3.3.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.564.0",
  "recharts": "2.15.0"
}
```

### DevDependencies
```json
"devDependencies": {
  "typescript": "5.7.3",
  "tailwindcss": "^4.2.0",
  "postcss": "^8.5",
  "prettier": "^3.5.3",
  "@types/react": "^19",
  "@types/node": "^22"
}
```

---

## ⚙️ Конфигурация

### `next.config.js`
```js
const nextConfig = {
  reactStrictMode: true,
  // webpack: ... (настройки)
};
```
- Включён строгий режим React.
- Возможна кастомизация Webpack (например, для сборки SVG).

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```
- Строгая типизация.
- Поддержка алиасов `@/components`, `@/lib`.

### `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
- URL бэкенда.
- Может быть изменён для продакшена.

---

## 🎨 Дизайн и темизация

### Цветовая схема
- Используется **OKLCH** — современное цветовое пространство.
- Поддержка светлой и тёмной темы через CSS-переменные:
  ```css
  :root { --background: oklch(1 0 0); }
  .dark { --background: oklch(0.145 0 0); }
  ```
- Автоматическая подсветка ошибок, прогресса, сложности заданий.

### UI-компоненты
- Все компоненты из `components/ui` используют:
  - `data-slot` — семантика
  - `cva` — варианты (button, badge)
  - `cn()` — безопасное объединение классов
- Адаптивность: `@container`, `sm:`, `md:`, `lg:`

---

## 🔐 Аутентификация

### Механизм
- JWT-токен хранится в `localStorage`.
- При 401 — автоматический выход и редирект на `/login`.
- Стор: `useAuthStore` (Zustand + persist).

### Потенциальные улучшения
- ✅ Перейти на **HTTP-only cookie** для защиты от XSS.
- ✅ Добавить CSRF-токен.
- ✅ Реализовать refresh-токен.

---

## 🔄 Состояние (Zustand)

| Стор | Назначение |
|------|-----------|
| `useAuthStore` | Пользователь, сессия, авторизация |
| `useTaskStore` | Задания, отправка ответов, результаты |
| `useProgressStore` | Прогресс пользователя, история попыток |

Все сторы:
- Имеют `isLoading`, `error`, `clearError`.
- Сохраняются между перезагрузками (`persist`).
- Интегрированы с `api-client`.

---

## 📡 API-взаимодействие

### Базовый URL
```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

### Эндпоинты
| Метод | Путь | Описание |
|------|------|--------|
| `POST` | `/api/auth/login` | Вход |
| `POST` | `/api/auth/register` | Регистрация |
| `GET` | `/api/tasks` | Список заданий |
| `GET` | `/api/tasks/:id` | Полное задание |
| `POST` | `/api/tasks/:id/submit` | Отправка ответов |
| `GET` | `/api/user/progress` | Прогресс пользователя |
| `GET` | `/api/results/:id` | Результат попытки |

---

## 🧪 Возможные улучшения

### 1. **Серверные компоненты**
- Перевести `HomePage`, `Dashboard` на Server Components.
- Использовать `generateMetadata` для SEO.

### 2. **Моки API (MSW)**
- Добавить `Mock Service Worker` для разработки без бэкенда.

### 3. **Админка**
- Создать `/admin` для управления заданиями.

### 4. **Интеграция с Sentry**
- Логирование ошибок в продакшене.

### 5. **Docker**
- Контейнеризация клиента:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN yarn install
  COPY . .
  RUN yarn build
  CMD ["yarn", "start"]
  ```

---

## ✅ Статус

Проект **готов к интеграции с бэкендом** и дальнейшему развитию. Архитектура масштабируема, код чистый, типизация полная.

> 💬 Следующий шаг: анализ серверной части (`backend`) для создания согласованной системы.

--- 

📝 *Документация обновлена: 03.05.2026*
````````markdown
# 📄 Клиентское приложение: Analyst Trainer

> **Название проекта:** `analiticsimulator/client`  
> **Путь:** `C:\Users\Admin\IdeaProjects\analiticsimulator\client`  
> **Тип:** Next.js 16 (App Router) + TypeScript + Tailwind CSS  
> **Описание:** Интерактивный тренажёр для аналитиков данных. Включает задания по SQL, A/B-тестам, метрикам, воронкам и интерпретации данных.

---

## 🧭 Обзор

Клиентская часть представляет собой полноценное **React-приложение на базе Next.js**, ориентированное на обучение и самопроверку навыков аналитики. Приложение использует современные практики разработки:

- Полная типизация через **TypeScript**
- Управление состоянием через **Zustand**
- Формы с валидацией через **react-hook-form + Zod**
- UI-компоненты на основе **shadcn/ui** и **Radix UI**
- Темизация через **OKLCH-цвета**
- Поддержка светлой и тёмной темы

---

## 🗂️ Структура проекта

```bash
client/
├── .idea/                  # Конфигурация IDE (IntelliJ/WebStorm)
├── app/                    # App Router (Next.js)
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── tasks/[id]/
│   ├── results/[submissionId]/
│   ├── layout.tsx
│   ├── page.tsx            # Главная страница
│   └── ...
├── components/             # Компоненты приложения
│   ├── layout/             # Header, AuthGuard
│   ├── tasks/              # TestTask, ErrorFindTask, OpenTask, TaskList
│   ├── dashboard/          # StatsCard, ProgressChart, HistoryTable
│   └── ui/                 # Примитивы (Button, Card, Field, Input и др.)
├── lib/                    # Вспомогательные утилиты
│   ├── api/                # API-клиент и адаптеры
│   │   ├── client.ts       # HTTP-запросы
│   │   └── adapter.ts      # Маппинг DTO → доменная модель
│   ├── stores/             # Zustand-сторы
│   │   ├── auth-store.ts
│   │   ├── task-store.ts
│   │   └── progress-store.ts
│   └── utils/
│       ├── cn.ts           # Утилита для объединения классов
│       └── formatters.ts   # Форматирование дат, сложности, цветов
├── store/                  # Экспорт всех сторов (index.ts)
├── styles/                 # Глобальные стили
│   └── globals.css         # Tailwind + OKLCH + темизация
├── types/                  # TypeScript-типы
│   └── index.ts            # Все интерфейсы и enum'ы
├── .env.local              # Переменные окружения
├── .gitignore              # Игнорируемые файлы
├── .prettierrc             # Настройки форматирования
├── next.config.js          # Конфигурация Next.js
├── tsconfig.json           # Конфигурация TypeScript
├── package.json            # Зависимости и скрипты
├── yarn.lock               # Версии пакетов
├── Dockerfile              # Контейнеризация клиента
└── postcss.config.mjs      # Конфигурация PostCSS
```

---

## 🔌 Основные технологии

| Технология | Назначение |
|----------|----------|
| **Next.js 16** | Серверные компоненты, роутинг, метаданные |
| **React 19** | UI-библиотека |
| **TypeScript** | Типизация всего кода |
| **Tailwind CSS** | Утилитарные классы |
| **OKLCH** | Цветовое пространство для точной передачи цветов |
| **Zustand** | Управление глобальным состоянием |
| **Zod** | Валидация форм и API-ответов |
| **react-hook-form** | Управление формами |
| **shadcn/ui** | Дизайн-система на базе Radix UI |
| **Recharts** | Графики прогресса |
| **Lucide React** | Иконки |

---

## 🛠️ Зависимости (package.json)

### Основные
```json
"dependencies": {
  "next": "16.2.0",
  "react": "^19",
  "react-dom": "^19",
  "zustand": "^5.0.12",
  "zod": "^3.24.1",
  "react-hook-form": "^7.54.1",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^3.3.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.564.0",
  "recharts": "2.15.0"
}
```

### DevDependencies
```json
"devDependencies": {
  "typescript": "5.7.3",
  "tailwindcss": "^4.2.0",
  "postcss": "^8.5",
  "prettier": "^3.5.3",
  "@types/react": "^19",
  "@types/node": "^22"
}
```

---

## ⚙️ Конфигурация

### `next.config.js`
```js
const nextConfig = {
  reactStrictMode: true,
  // webpack: ... (настройки)
};
```
- Включён строгий режим React.
- Возможна кастомизация Webpack (например, для сборки SVG).

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```
- Строгая типизация.
- Поддержка алиасов `@/components`, `@/lib`.

### `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
- URL бэкенда.
- Может быть изменён для продакшена.

---

## 🎨 Дизайн и темизация

### Цветовая схема
- Используется **OKLCH** — современное цветовое пространство.
- Поддержка светлой и тёмной темы через CSS-переменные:
  ```css
  :root { --background: oklch(1 0 0); }
  .dark { --background: oklch(0.145 0 0); }
  ```
- Автоматическая подсветка ошибок, прогресса, сложности заданий.

### UI-компоненты
- Все компоненты из `components/ui` используют:
  - `data-slot` — семантика
  - `cva` — варианты (button, badge)
  - `cn()` — безопасное объединение классов
- Адаптивность: `@container`, `sm:`, `md:`, `lg:`

---

## 🔐 Аутентификация

### Механизм
- JWT-токен хранится в `localStorage`.
- При 401 — автоматический выход и редирект на `/login`.
- Стор: `useAuthStore` (Zustand + persist).

### Потенциальные улучшения
- ✅ Перейти на **HTTP-only cookie** для защиты от XSS.
- ✅ Добавить CSRF-токен.
- ✅ Реализовать refresh-токен.

---

## 🔄 Состояние (Zustand)

| Стор | Назначение |
|------|-----------|
| `useAuthStore` | Пользователь, сессия, авторизация |
| `useTaskStore` | Задания, отправка ответов, результаты |
| `useProgressStore` | Прогресс пользователя, история попыток |

Все сторы:
- Имеют `isLoading`, `error`, `clearError`.
- Сохраняются между перезагрузками (`persist`).
- Интегрированы с `api-client`.

---

## 📡 API-взаимодействие

### Базовый URL
```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

### Эндпоинты
| Метод | Путь | Описание |
|------|------|--------|
| `POST` | `/api/auth/login` | Вход |
| `POST` | `/api/auth/register` | Регистрация |
| `GET` | `/api/tasks` | Список заданий |
| `GET` | `/api/tasks/:id` | Полное задание |
| `POST` | `/api/tasks/:id/submit` | Отправка ответов |
| `GET` | `/api/user/progress` | Прогресс пользователя |
| `GET` | `/api/results/:id` | Результат попытки |

---

## 🧪 Возможные улучшения

### 1. **Серверные компоненты**
- Перевести `HomePage`, `Dashboard` на Server Components.
- Использовать `generateMetadata` для SEO.

### 2. **Моки API (MSW)**
- Добавить `Mock Service Worker` для разработки без бэкенда.

### 3. **Админка**
- Создать `/admin` для управления заданиями.

### 4. **Интеграция с Sentry**
- Логирование ошибок в продакшене.

### 5. **Docker**
- Контейнеризация клиента:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN yarn install
  COPY . .
  RUN yarn build
  CMD ["yarn", "start"]
  ```


