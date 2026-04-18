import { create } from 'zustand';
import { UserProgress } from '@/types';
import { api } from '@/lib/api/client';

interface ProgressState {
  progress: UserProgress | null;
  isLoading: boolean;
  error: string | null;

  fetchProgress: () => Promise<void>;
  clearError: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: null,
  isLoading: false,
  error: null,

  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const progress = await api.progress.get();
      set({ progress, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка загрузки прогресса',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
