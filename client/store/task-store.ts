import { create } from 'zustand';
import { Task, TaskDetail, SubmissionResult, SubmissionAnswer } from '@/types';
import { api } from '@/lib/api/client';

interface TaskState {
  tasks: Task[];
  currentTask: TaskDetail | null;
  lastResult: SubmissionResult | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  submitTask: (taskId: string, answers: SubmissionAnswer) => Promise<SubmissionResult>;
  fetchResult: (submissionId: string) => Promise<void>;
  clearCurrentTask: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  lastResult: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.tasks.getAll();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка загрузки заданий',
        isLoading: false,
      });
    }
  },

  fetchTask: async (id: string) => {
    set({ isLoading: true, error: null, currentTask: null });
    try {
      const task = await api.tasks.getById(id);
      set({ currentTask: task, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка загрузки задания',
        isLoading: false,
      });
    }
  },

  submitTask: async (taskId: string, answers: SubmissionAnswer) => {
    set({ isSubmitting: true, error: null });
    try {
      const result = await api.tasks.submit(taskId, answers);
      set({ lastResult: result, isSubmitting: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка отправки ответа',
        isSubmitting: false,
      });
      throw error;
    }
  },

  fetchResult: async (submissionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.results.getById(submissionId);
      set({ lastResult: result, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка загрузки результата',
        isLoading: false,
      });
    }
  },

  clearCurrentTask: () => set({ currentTask: null, lastResult: null }),
  clearError: () => set({ error: null }),
}));
