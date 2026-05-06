import {
  AuthResponse,
  Difficulty,
  HistoryItem,
  Session,
  SubmissionAnswer,
  SubmissionResult,
  Task,
  TaskDetail,
  TaskType,
  User,
  UserProgress,
} from '@/types';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const SESSION_KEY = 'session';
const AUTH_USER_KEY = 'auth-user-profile';
const submissionCache = new Map<string, SubmissionResult>();

interface RegisterDto {
  id: number;
  username: string;
  name: string;
  email: string;
}

interface UserProgressRow {
  taskId: number;
  question: string;
  topicId: number;
  taskType: string;
  complexity: string;
  isCompleted?: boolean;
  completed?: boolean;
  score: number | null;
}

interface SubmitDto {
  correct: boolean;
  score: number;
  message: string;
  alreadyCompleted: boolean;
}

export const getSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored) as Session;
    if (new Date(session.expiresAt) < new Date()) {
      removeSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const setSession = (session: Session): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const removeSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

const setAuthUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const getAuthUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1];
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function jwtSubject(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  if (typeof payload.upn === 'string') return payload.upn;
  if (typeof payload.sub === 'string') return payload.sub;
  return null;
}

function jwtExpiry(token: string): string {
  const payload = decodeJwtPayload(token);
  if (payload && typeof payload.exp === 'number') {
    return new Date(payload.exp * 1000).toISOString();
  }
  return new Date(Date.now() + 3600 * 1000).toISOString();
}

function normalizeToken(value: unknown): string {
  if (typeof value !== 'string') return '';
  // Sometimes backend/token parsers may return quoted string JSON.
  return value.trim().replace(/^"|"$/g, '');
}

function toTaskType(raw: string): TaskType {
  if (raw === 'TEST') return TaskType.TEST;
  if (raw === 'ERROR_DETECTION') return TaskType.ERROR_FIND;
  return TaskType.OPEN;
}

function toDifficulty(raw: string): Difficulty {
  if (raw === 'EASY') return Difficulty.EASY;
  if (raw === 'HARD') return Difficulty.HARD;
  return Difficulty.MEDIUM;
}

function rowToTask(row: UserProgressRow): Task {
  const title = row.question.length > 90 ? `${row.question.slice(0, 87)}...` : row.question;
  return {
    id: String(row.taskId),
    title,
    type: toTaskType(row.taskType),
    difficulty: toDifficulty(row.complexity),
    description: '',
    completed: Boolean(row.completed ?? row.isCompleted),
    score: row.score ?? undefined,
  };
}

function rowToDetail(row: UserProgressRow): TaskDetail {
  const task = rowToTask(row);
  return {
    ...task,
    content: row.question,
    minWords: 1,
  };
}

function answersToText(answers: SubmissionAnswer): string {
  if (answers.openAnswer?.trim()) return answers.openAnswer.trim();
  if (answers.selectedOptionId?.trim()) return answers.selectedOptionId.trim();
  if (answers.questionId?.trim()) return answers.questionId.trim();
  if (answers.foundErrors?.length) return answers.foundErrors.join(', ');
  return '';
}

async function request(path: string, init: RequestInit = {}, auth = true): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth) {
    const session = getSession();
    if (session?.accessToken) {
      headers.set('Authorization', `Bearer ${normalizeToken(session.accessToken)}`);
    }
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  return res;
}

async function requestJson<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const res = await request(path, init, auth);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || res.statusText || `HTTP ${res.status}`);
  }
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

async function fetchTaskRows(): Promise<UserProgressRow[]> {
  return requestJson<UserProgressRow[]>('/api/tasks/tasks', { method: 'GET' });
}

export const api = {
  auth: {
    async register(email: string, password: string, name: string): Promise<AuthResponse> {
      const username = email.split('@')[0] || `user_${Date.now()}`;
      const dto = await requestJson<RegisterDto>(
        '/api/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ name, email, username, password }),
        },
        false,
      );
      const loginTokenRaw = await requestJson<string>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ emailOrUsername: email, password }),
        },
        false,
      );
      const loginToken = normalizeToken(loginTokenRaw);
      const user: User = {
        id: String(dto.id),
        name: dto.name,
        email: dto.email,
        createdAt: new Date().toISOString(),
      };
      const session: Session = {
        id: `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId: jwtSubject(loginToken) ?? user.id,
        expiresAt: jwtExpiry(loginToken),
        accessToken: loginToken,
      };
      setSession(session);
      setAuthUser(user);
      return { session, user };
    },

    async login(emailOrUsername: string, password: string): Promise<AuthResponse> {
      const tokenRaw = await requestJson<string>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ emailOrUsername, password }),
        },
        false,
      );
      const token = normalizeToken(tokenRaw);
      const fallbackUser: User = {
        id: jwtSubject(token) ?? emailOrUsername,
        name: emailOrUsername,
        email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@local`,
        createdAt: new Date().toISOString(),
      };
      const user = getAuthUser() ?? fallbackUser;
      const session: Session = {
        id: `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId: jwtSubject(token) ?? user.id,
        expiresAt: jwtExpiry(token),
        accessToken: token,
      };
      setSession(session);
      setAuthUser(user);
      return { session, user };
    },

    async logout(): Promise<void> {
      removeSession();
    },

    async getCurrentUser(): Promise<AuthResponse['user'] | null> {
      const session = getSession();
      if (!session?.accessToken) return null;
      return getAuthUser();
    },

    async refreshSession(): Promise<Session | null> {
      const session = getSession();
      if (!session?.accessToken) return null;
      return session;
    },
  },

  tasks: {
    async getAll(): Promise<Task[]> {
      const rows = await fetchTaskRows();
      return rows.map(rowToTask);
    },

    async getById(id: string): Promise<TaskDetail> {
      const row = await requestJson<UserProgressRow>(`/api/tasks/${encodeURIComponent(id)}`, {
        method: 'GET',
      });
      return rowToDetail(row);
    },

    async submit(taskId: string, answers: SubmissionAnswer): Promise<SubmissionResult> {
      const answer = answersToText(answers);
      if (!answer) throw new Error('Введите ответ');
      const raw = await requestJson<SubmitDto>(`/api/tasks/submit/${encodeURIComponent(taskId)}`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      });
      const detail = await this.getById(taskId);
      const result: SubmissionResult = {
        submissionId: `sub_${taskId}_${Date.now()}`,
        taskId,
        taskTitle: detail.title,
        score: raw.score,
        maxScore: 100,
        feedback: {
          correct: raw.correct ? 1 : 0,
          total: 1,
          details: [
            {
              questionId: 'answer',
              isCorrect: raw.correct || raw.alreadyCompleted,
              correctAnswer: raw.message,
            },
          ],
        },
        completedAt: new Date().toISOString(),
      };
      submissionCache.set(result.submissionId, result);
      return result;
    },
  },

  progress: {
    async get(): Promise<UserProgress> {
      const rows = await fetchTaskRows();
      const completedRows = rows.filter((r) => Boolean(r.completed ?? r.isCompleted));
      const history: HistoryItem[] = completedRows.map((r) => ({
        taskId: String(r.taskId),
        taskTitle: r.question.length > 80 ? `${r.question.slice(0, 77)}...` : r.question,
        taskType: toTaskType(r.taskType),
        score: r.score ?? 0,
        maxScore: 100,
        date: new Date().toISOString(),
      }));
      return {
        totalScore: completedRows.reduce((s, r) => s + (r.score ?? 0), 0),
        completedTasks: completedRows.length,
        totalTasks: rows.length,
        history,
      };
    },
  },

  results: {
    async getById(submissionId: string): Promise<SubmissionResult> {
      const cached = submissionCache.get(submissionId);
      if (!cached) throw new Error('Результат не найден');
      return cached;
    },
  },
};
