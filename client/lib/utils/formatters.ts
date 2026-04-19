import { Difficulty, TaskType } from '@/types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    [Difficulty.EASY]: 'Легкий',
    [Difficulty.MEDIUM]: 'Средний',
    [Difficulty.HARD]: 'Сложный',
  };
  return labels[difficulty];
}

export function getDifficultyColor(difficulty: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    [Difficulty.EASY]: 'bg-emerald-100 text-emerald-700',
    [Difficulty.MEDIUM]: 'bg-amber-100 text-amber-700',
    [Difficulty.HARD]: 'bg-rose-100 text-rose-700',
  };
  return colors[difficulty];
}

export function getTaskTypeLabel(type: TaskType): string {
  const labels: Record<TaskType, string> = {
    [TaskType.TEST]: 'Тест',
    [TaskType.ERROR_FIND]: 'Поиск ошибок',
    [TaskType.OPEN]: 'Открытый ответ',
  };
  return labels[type];
}

export function getTaskTypeIcon(type: TaskType): string {
  const icons: Record<TaskType, string> = {
    [TaskType.TEST]: 'list-checks',
    [TaskType.ERROR_FIND]: 'search',
    [TaskType.OPEN]: 'pen-line',
  };
  return icons[type];
}

export function getScoreColor(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 'text-emerald-600';
  if (percentage >= 60) return 'text-amber-600';
  return 'text-rose-600';
}

export function getScoreBgColor(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}
