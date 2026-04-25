import { TaskType, Difficulty, Task, TaskDetail, UserProgress } from '@/types';

export const mapTaskTypeFromApi = (type: string): TaskType => {
  const map: Record<string, TaskType> = {
    'TEST': TaskType.TEST,
    'ERROR_DETECTION': TaskType.ERROR_FIND,
    'PRACTICE': TaskType.OPEN,
  };
  return map[type] || TaskType.TEST;
};

export const mapDifficultyFromApi = (difficulty: string): Difficulty => {
  const map: Record<string, Difficulty> = {
    'EASY': Difficulty.EASY,
    'MEDIUM': Difficulty.MEDIUM,
    'HARD': Difficulty.HARD,
  };
  return map[difficulty] || Difficulty.EASY;
};

export const mapTaskFromApi = (dto: any): Task => ({
  id: dto.id,
  title: dto.question,
  type: mapTaskTypeFromApi(dto.taskType),
  difficulty: mapDifficultyFromApi(dto.complexity),
  description: dto.hint || '',
});

export const mapTaskDetailFromApi = (dto: any): TaskDetail => ({
  id: dto.id,
  title: dto.question,
  type: mapTaskTypeFromApi(dto.taskType),
  difficulty: mapDifficultyFromApi(dto.complexity),
  description: dto.hint || '',
  content: dto.answer || '',
  questions: dto.questions || [],
  artifacts: dto.artifacts || [],
  artifactTemplate: dto.artifactTemplate || '',
});

export const mapProgressFromApi = (response: any): UserProgress => {
  return {
    totalScore: response.totalScore,
    completedTasks: response.tasksCompleted,
    totalTasks: response.totalTasks,
    history: response.history.map((item: any) => ({
      taskId: item.taskId,
      taskTitle: item.taskTitle,
      taskType: mapTaskTypeFromApi(item.taskType),
      score: item.score,
      maxScore: item.maxScore,
      date: item.completedAt || new Date().toISOString(),
    })),
  };
};