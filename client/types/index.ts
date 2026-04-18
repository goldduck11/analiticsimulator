// Типы заданий и сложность
export enum TaskType {
  TEST = 'test',
  ERROR_FIND = 'error_find',
  OPEN = 'open',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// Кто пользователь и что приходит после входа
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface AuthResponse {
  session: Session;
  user: User;
}

// Карточка задания и расширенное описание (с вопросами и т.д.)
export interface Task {
  id: string;
  title: string;
  type: TaskType;
  difficulty: Difficulty;
  description: string;
}

export interface TestOption {
  id: string;
  text: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: TestOption[];
  correctOptionId: string;
}

export interface ErrorItem {
  id: string;
  text: string;
  hasError: boolean;
  errorDescription?: string;
}

export interface TaskDetail extends Task {
  content: string;
  /** Тест: варианты ответов */
  questions?: TestQuestion[];
  /** Найди ошибку: куски текста, часть с багами */
  artifacts?: ErrorItem[];
  /** Открытый ответ: шаблон или подсказка к формулировке */
  artifactTemplate?: string;
}

// Что пользователь отправляет и что приходит после проверки задания
export interface SubmissionAnswer {
  questionId?: string;
  selectedOptionId?: string;
  foundErrors?: string[];
  openAnswer?: string;
}

export interface SubmissionRequest {
  answers: SubmissionAnswer;
}

export interface Feedback {
  correct: number;
  total: number;
  details: {
    questionId: string;
    isCorrect: boolean;
    correctAnswer?: string;
  }[];
}

export interface SubmissionResult {
  submissionId: string;
  taskId: string;
  taskTitle: string;
  score: number;
  maxScore: number;
  feedback: Feedback;
  completedAt: string;
}

// Сводка по прогрессу и история попыток
export interface HistoryItem {
  taskId: string;
  taskTitle: string;
  taskType: TaskType;
  score: number;
  maxScore: number;
  date: string;
}

export interface UserProgress {
  totalScore: number;
  completedTasks: number;
  totalTasks: number;
  history: HistoryItem[];
}

// Если бэкенд завернёт ответ в { data, success, message } — сюда
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
