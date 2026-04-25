export enum TaskType {
  TEST = 'TEST',
  ERROR_FIND = 'ERROR_DETECTION',
  OPEN = 'PRACTICE',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

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
  questions?: TestQuestion[];
  artifacts?: ErrorItem[];
  artifactTemplate?: string;
}

export interface SubmissionAnswer {
  questionId?: string;
  selectedOptionId?: string;
  foundErrors?: string[];
  openAnswer?: string;
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

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}