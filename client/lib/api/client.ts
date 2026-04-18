import {
  AuthResponse,
  Session,
  Task,
  TaskDetail,
  UserProgress,
  SubmissionResult,
  SubmissionAnswer,
} from '@/types';
import {
  mockUser,
  mockTasks,
  mockTaskDetails,
  mockProgress,
  mockSubmissionResults,
} from '@/lib/mock-data';

// Небольшая пауза, чтобы интерфейс ощущался как при реальном запросе
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// В прототипе «сессия» лежит в localStorage; на бэкенде это заменят cookie или токены
const SESSION_KEY = 'session';

export const getSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as Session;
    // Просрочена — выкидываем, дальше как будто пользователь не залогинен
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
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
};

const createSession = (userId: string): Session => ({
  id: `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  userId,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
});

// Заглушка под настоящий HTTP-слой: всё из mock-data и локальной памяти
export const api = {
  auth: {
    async register(email: string, password: string, name: string): Promise<AuthResponse> {
      await delay(500);

      if (!email || !password || !name) {
        throw new Error('Все поля обязательны для заполнения');
      }

      const userId = `user_${Date.now()}`;
      const user = { ...mockUser, email, name, id: userId };
      const session = createSession(userId);

      setSession(session);
      return { session, user };
    },

    async login(email: string, password: string): Promise<AuthResponse> {
      await delay(500);

      if (!email || !password) {
        throw new Error('Email и пароль обязательны');
      }

      if (password.length < 4) {
        throw new Error('Неверный email или пароль');
      }

      const userId = mockUser.id;
      const user = { ...mockUser, email };
      const session = createSession(userId);

      setSession(session);
      return { session, user };
    },

    async logout(): Promise<void> {
      await delay(200);
      removeSession();
    },

    async getCurrentUser(): Promise<AuthResponse['user'] | null> {
      await delay(300);
      const session = getSession();
      if (!session) return null;
      return mockUser;
    },

    async refreshSession(): Promise<Session | null> {
      await delay(200);
      const currentSession = getSession();
      if (!currentSession) return null;

      const newSession = createSession(currentSession.userId);
      setSession(newSession);
      return newSession;
    },
  },

  tasks: {
    async getAll(): Promise<Task[]> {
      await delay(400);
      return mockTasks;
    },

    async getById(id: string): Promise<TaskDetail> {
      await delay(300);
      const task = mockTaskDetails[id];
      if (!task) {
        throw new Error('Задание не найдено');
      }
      return task;
    },

    async submit(taskId: string, answers: SubmissionAnswer): Promise<SubmissionResult> {
      await delay(800);

      const task = mockTaskDetails[taskId];
      if (!task) {
        throw new Error('Задание не найдено');
      }

      const submissionId = `sub_${Date.now()}`;
      let score = 0;
      const maxScore = 100;
      const details: SubmissionResult['feedback']['details'] = [];

      // В бою оценку должен считать сервер; здесь упрощённая логика для демо
      if (task.type === 'test' && task.questions && answers.questionId) {
        const answerMap = JSON.parse(answers.questionId) as Record<string, string>;
        const total = task.questions.length;
        let correct = 0;

        task.questions.forEach((q) => {
          const isCorrect = answerMap[q.id] === q.correctOptionId;
          if (isCorrect) correct++;
          details.push({
            questionId: q.id,
            isCorrect,
            correctAnswer: q.options.find((o) => o.id === q.correctOptionId)?.text,
          });
        });

        score = Math.round((correct / total) * 100);
      } else if (task.type === 'error_find' && task.artifacts && answers.foundErrors) {
        const correctErrors = task.artifacts.filter((a) => a.hasError).map((a) => a.id);
        const foundErrors = answers.foundErrors;

        let correct = 0;
        correctErrors.forEach((errorId) => {
          const isFound = foundErrors.includes(errorId);
          if (isFound) correct++;
          details.push({
            questionId: errorId,
            isCorrect: isFound,
          });
        });

        const falsePositives = foundErrors.filter((id) => !correctErrors.includes(id)).length;
        const adjustedCorrect = Math.max(0, correct - falsePositives * 0.5);
        score = Math.round((adjustedCorrect / correctErrors.length) * 100);
      } else if (task.type === 'open' && answers.openAnswer) {
        const wordCount = answers.openAnswer.trim().split(/\s+/).length;
        score = Math.min(100, Math.round(wordCount * 2));
        details.push({
          questionId: 'open',
          isCorrect: score >= 50,
        });
      }

      const result: SubmissionResult = {
        submissionId,
        taskId,
        taskTitle: task.title,
        score,
        maxScore,
        feedback: {
          correct: details.filter((d) => d.isCorrect).length,
          total: details.length,
          details,
        },
        completedAt: new Date().toISOString(),
      };

      mockSubmissionResults[submissionId] = result;
      return result;
    },
  },

  progress: {
    async get(): Promise<UserProgress> {
      await delay(400);
      return mockProgress;
    },
  },

  results: {
    async getById(submissionId: string): Promise<SubmissionResult> {
      await delay(300);
      const result = mockSubmissionResults[submissionId];
      if (!result) {
        throw new Error('Результат не найден');
      }
      return result;
    },
  },
};
