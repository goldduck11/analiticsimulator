import {
  ApiResponse,
  Task,
  TaskDetail,
  UserProgress,
  SubmissionResult,
  SubmissionAnswer,
  User,
  Session,
  AuthResponse,
} from '@/types';
import { mapTaskFromApi, mapTaskDetailFromApi, mapProgressFromApi } from './adapter';
import { useAuthStore } from '@/lib/stores/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Ошибка сети');
  }

  const data: ApiResponse<T> = await res.json();
  return data.data;
}

export function getSession() {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  const sessionStr = localStorage.getItem('auth_session');
  if (token && sessionStr && userStr) {
    return {
      token,
      session: JSON.parse(sessionStr),
      user: JSON.parse(userStr),
    };
  }
  return null;
}

export function removeSession() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_session');
}

export const api = {
  auth: {
    async login(email: string, password: string) {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: email, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Неверный email или пароль');
      }

      const data: AuthResponse & { token: string } = await response.json();
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('auth_session', JSON.stringify(data.session));
      return {
        user: data.user,
        session: data.session,
        token: data.token,
      };
    },

    async register(name: string, email: string, username: string, password: string) {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Ошибка регистрации');
      }

      const data: AuthResponse & { token: string } = await response.json();
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('auth_session', JSON.stringify(data.session));
      return {
        user: data.user,
        session: data.session,
        token: data.token,
      };
    },

    async logout() {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        removeSession();
      }
    },

    async getCurrentUser() {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        return JSON.parse(userStr) as User;
      }
      throw new Error('Not authenticated');
    },
  },
  tasks: {
    async getAll(): Promise<Task[]> {
      const tasks = await request<any[]>('/api/tasks');
      return tasks.map(mapTaskFromApi);
    },
    async getById(id: string): Promise<TaskDetail> {
      const task = await request<any>(`/api/tasks/${id}`);
      return mapTaskDetailFromApi(task);
    },
    async submit(taskId: string, answers: SubmissionAnswer) {
      return request<SubmissionResult>(`/api/tasks/${taskId}/submit`, {
        method: 'POST',
        body: JSON.stringify(answers),
      });
    },
  },
  progress: {
    async get(): Promise<UserProgress> {
      const response = await request<any>('/api/user/progress');
      return mapProgressFromApi(response);
    },
  },
  results: {
    async getById(submissionId: string) {
      return request<SubmissionResult>(`/api/results/${submissionId}`);
    },
  },
};