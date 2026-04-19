import {
  Task,
  TaskDetail,
  TaskType,
  Difficulty,
  UserProgress,
  SubmissionResult,
  User,
} from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'analyst@example.com',
  name: 'Алексей Иванов',
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Основы SQL-запросов',
    type: TaskType.TEST,
    difficulty: Difficulty.EASY,
    description: 'Проверьте свои знания основ SQL: SELECT, WHERE, JOIN и агрегатные функции.',
  },
  {
    id: '2',
    title: 'Анализ воронки продаж',
    type: TaskType.ERROR_FIND,
    difficulty: Difficulty.MEDIUM,
    description: 'Найдите ошибки в расчёте конверсии воронки продаж и метрик привлечения.',
  },
  {
    id: '3',
    title: 'Интерпретация A/B теста',
    type: TaskType.OPEN,
    difficulty: Difficulty.HARD,
    description: 'Проанализируйте результаты A/B теста и сформулируйте рекомендации для бизнеса.',
  },
  {
    id: '4',
    title: 'Метрики продукта',
    type: TaskType.TEST,
    difficulty: Difficulty.MEDIUM,
    description: 'Тест на знание ключевых продуктовых метрик: DAU, MAU, Retention, LTV, CAC.',
  },
  {
    id: '5',
    title: 'Ошибки в дашборде',
    type: TaskType.ERROR_FIND,
    difficulty: Difficulty.EASY,
    description: 'Найдите логические ошибки в отчёте по ключевым показателям эффективности.',
  },
  {
    id: '6',
    title: 'Когортный анализ',
    type: TaskType.OPEN,
    difficulty: Difficulty.MEDIUM,
    description: 'Проведите когортный анализ и определите тренды удержания пользователей.',
  },
];

export const mockTaskDetails: Record<string, TaskDetail> = {
  '1': {
    id: '1',
    title: 'Основы SQL-запросов',
    type: TaskType.TEST,
    difficulty: Difficulty.EASY,
    description: 'Проверьте свои знания основ SQL: SELECT, WHERE, JOIN и агрегатные функции.',
    content:
      'Ответьте на вопросы о базовых SQL-запросах. Выберите один правильный ответ для каждого вопроса.',
    questions: [
      {
        id: 'q1',
        question: 'Какой оператор используется для выборки уникальных значений?',
        options: [
          { id: 'a', text: 'UNIQUE' },
          { id: 'b', text: 'DISTINCT' },
          { id: 'c', text: 'DIFFERENT' },
          { id: 'd', text: 'SINGLE' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        question: 'Какая агрегатная функция возвращает количество строк?',
        options: [
          { id: 'a', text: 'SUM()' },
          { id: 'b', text: 'AVG()' },
          { id: 'c', text: 'COUNT()' },
          { id: 'd', text: 'TOTAL()' },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'q3',
        question: 'Какой тип JOIN возвращает только совпадающие строки из обеих таблиц?',
        options: [
          { id: 'a', text: 'LEFT JOIN' },
          { id: 'b', text: 'RIGHT JOIN' },
          { id: 'c', text: 'FULL JOIN' },
          { id: 'd', text: 'INNER JOIN' },
        ],
        correctOptionId: 'd',
      },
      {
        id: 'q4',
        question: 'Какой оператор используется для фильтрации агрегированных данных?',
        options: [
          { id: 'a', text: 'WHERE' },
          { id: 'b', text: 'HAVING' },
          { id: 'c', text: 'FILTER' },
          { id: 'd', text: 'GROUP' },
        ],
        correctOptionId: 'b',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Анализ воронки продаж',
    type: TaskType.ERROR_FIND,
    difficulty: Difficulty.MEDIUM,
    description: 'Найдите ошибки в расчёте конверсии воронки продаж и метрик привлечения.',
    content:
      'Перед вами отчёт по воронке продаж. Некоторые расчёты содержат ошибки. Отметьте строки с ошибками.',
    artifacts: [
      {
        id: 'e1',
        text: 'Визиты на сайт: 10,000 → Конверсия в регистрацию: 15% → Регистрации: 1,500',
        hasError: false,
      },
      {
        id: 'e2',
        text: 'Регистрации: 1,500 → Конверсия в активацию: 40% → Активации: 750',
        hasError: true,
        errorDescription: 'Ошибка расчёта: 1,500 × 40% = 600, а не 750',
      },
      {
        id: 'e3',
        text: 'Активации: 600 → Конверсия в покупку: 25% → Покупки: 150',
        hasError: false,
      },
      {
        id: 'e4',
        text: 'CAC = Маркетинговый бюджет / Количество покупок = 30,000₽ / 150 = 300₽',
        hasError: true,
        errorDescription: 'Ошибка расчёта: 30,000 / 150 = 200₽, а не 300₽',
      },
      {
        id: 'e5',
        text: 'LTV = Средний чек × Среднее число покупок = 2,000₽ × 3 = 6,000₽',
        hasError: false,
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Интерпретация A/B теста',
    type: TaskType.OPEN,
    difficulty: Difficulty.HARD,
    description: 'Проанализируйте результаты A/B теста и сформулируйте рекомендации для бизнеса.',
    content: `## Данные A/B теста

**Гипотеза:** Новый дизайн кнопки "Купить" увеличит конверсию в покупку.

**Результаты:**
- Контрольная группа (A): 5,000 пользователей, 150 покупок (CR = 3.0%)
- Тестовая группа (B): 5,000 пользователей, 175 покупок (CR = 3.5%)

**Статистика:**
- p-value = 0.12
- Уровень значимости α = 0.05
- Относительный прирост: +16.7%

Проанализируйте результаты и дайте рекомендации.`,
    artifactTemplate: `## Ваш анализ

### 1. Статистическая значимость
[Ваш ответ]

### 2. Интерпретация результатов
[Ваш ответ]

### 3. Рекомендации для бизнеса
[Ваш ответ]`,
  },
  '4': {
    id: '4',
    title: 'Метрики продукта',
    type: TaskType.TEST,
    difficulty: Difficulty.MEDIUM,
    description: 'Тест на знание ключевых продуктовых метрик: DAU, MAU, Retention, LTV, CAC.',
    content: 'Проверьте свои знания ключевых продуктовых метрик.',
    questions: [
      {
        id: 'q1',
        question: 'Что показывает метрика Retention Day 7?',
        options: [
          { id: 'a', text: 'Процент пользователей, совершивших 7 действий' },
          { id: 'b', text: 'Процент пользователей, вернувшихся на 7-й день после регистрации' },
          { id: 'c', text: 'Количество дней до первой покупки' },
          { id: 'd', text: 'Средний доход за 7 дней' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        question: 'Как рассчитывается показатель DAU/MAU (Stickiness)?',
        options: [
          { id: 'a', text: 'DAU + MAU' },
          { id: 'b', text: 'MAU / DAU' },
          { id: 'c', text: 'DAU / MAU' },
          { id: 'd', text: 'DAU × MAU' },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'q3',
        question: 'Что означает отрицательный показатель Unit Economics?',
        options: [
          { id: 'a', text: 'Бизнес прибыльный' },
          { id: 'b', text: 'LTV меньше CAC' },
          { id: 'c', text: 'Высокий Retention' },
          { id: 'd', text: 'Низкий Churn Rate' },
        ],
        correctOptionId: 'b',
      },
    ],
  },
  '5': {
    id: '5',
    title: 'Ошибки в дашборде',
    type: TaskType.ERROR_FIND,
    difficulty: Difficulty.EASY,
    description: 'Найдите логические ошибки в отчёте по ключевым показателям эффективности.',
    content: 'Проверьте дашборд на наличие логических ошибок и несоответствий.',
    artifacts: [
      {
        id: 'e1',
        text: 'Выручка за январь: 1,000,000₽. Выручка за февраль: 1,200,000₽. Рост: 20%',
        hasError: false,
      },
      {
        id: 'e2',
        text: 'Средний чек: 500₽. Количество заказов: 2,400. Общая выручка: 1,000,000₽',
        hasError: true,
        errorDescription: 'Ошибка: 500 × 2,400 = 1,200,000₽, а не 1,000,000₽',
      },
      {
        id: 'e3',
        text: 'DAU: 1,000. MAU: 15,000. Stickiness (DAU/MAU): 6.7%',
        hasError: false,
      },
    ],
  },
  '6': {
    id: '6',
    title: 'Когортный анализ',
    type: TaskType.OPEN,
    difficulty: Difficulty.MEDIUM,
    description: 'Проведите когортный анализ и определите тренды удержания пользователей.',
    content: `## Данные для когортного анализа

| Когорта | Month 0 | Month 1 | Month 2 | Month 3 |
|---------|---------|---------|---------|---------|
| Январь  | 1000    | 400     | 250     | 180     |
| Февраль | 1200    | 520     | 340     | -       |
| Март    | 800     | 280     | -       | -       |

Проанализируйте данные и сделайте выводы.`,
    artifactTemplate: `## Ваш анализ

### 1. Расчёт Retention по когортам
[Ваш ответ]

### 2. Тренды и паттерны
[Ваш ответ]

### 3. Рекомендации
[Ваш ответ]`,
  },
};

export const mockProgress: UserProgress = {
  totalScore: 245,
  completedTasks: 4,
  totalTasks: 6,
  history: [
    {
      taskId: '1',
      taskTitle: 'Основы SQL-запросов',
      taskType: TaskType.TEST,
      score: 75,
      maxScore: 100,
      date: '2024-03-10T14:30:00Z',
    },
    {
      taskId: '2',
      taskTitle: 'Анализ воронки продаж',
      taskType: TaskType.ERROR_FIND,
      score: 80,
      maxScore: 100,
      date: '2024-03-12T10:15:00Z',
    },
    {
      taskId: '4',
      taskTitle: 'Метрики продукта',
      taskType: TaskType.TEST,
      score: 50,
      maxScore: 100,
      date: '2024-03-14T16:45:00Z',
    },
    {
      taskId: '5',
      taskTitle: 'Ошибки в дашборде',
      taskType: TaskType.ERROR_FIND,
      score: 40,
      maxScore: 100,
      date: '2024-03-15T09:20:00Z',
    },
  ],
};

export const mockSubmissionResults: Record<string, SubmissionResult> = {
  'sub-1': {
    submissionId: 'sub-1',
    taskId: '1',
    taskTitle: 'Основы SQL-запросов',
    score: 75,
    maxScore: 100,
    feedback: {
      correct: 3,
      total: 4,
      details: [
        { questionId: 'q1', isCorrect: true },
        { questionId: 'q2', isCorrect: true },
        { questionId: 'q3', isCorrect: false, correctAnswer: 'INNER JOIN' },
        { questionId: 'q4', isCorrect: true },
      ],
    },
    completedAt: '2024-03-10T14:30:00Z',
  },
};
