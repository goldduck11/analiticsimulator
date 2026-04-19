'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { TaskCard } from './task-card';
import { useTaskStore } from '@/store';
import { TaskType, Difficulty } from '@/types';
import { getTaskTypeLabel, getDifficultyLabel } from '@/lib/utils/formatters';

export function TaskList() {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TaskType | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || task.type === typeFilter;
    const matchesDifficulty = !difficultyFilter || task.difficulty === difficultyFilter;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const hasActiveFilters = typeFilter || difficultyFilter || search;

  const clearFilters = () => {
    setSearch('');
    setTypeFilter(null);
    setDifficultyFilter(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Поиск и строка фильтров */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск заданий..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={typeFilter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter(typeFilter ? null : TaskType.TEST)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Тип
          </Button>
        </div>
      </div>

      {/* Чипы активных фильтров */}
      <div className="flex flex-wrap gap-2">
        {/* По типу задания */}
        {Object.values(TaskType).map((type) => (
          <Badge
            key={type}
            variant={typeFilter === type ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
          >
            {getTaskTypeLabel(type)}
          </Badge>
        ))}
        <div className="mx-2 h-6 w-px bg-border" />
        {/* По сложности */}
        {Object.values(Difficulty).map((difficulty) => (
          <Badge
            key={difficulty}
            variant={difficultyFilter === difficulty ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setDifficultyFilter(difficultyFilter === difficulty ? null : difficulty)}
          >
            {getDifficultyLabel(difficulty)}
          </Badge>
        ))}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
            <X className="mr-1 h-3 w-3" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Сетка карточек заданий */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="Задания не найдены"
          description="Попробуйте изменить параметры поиска или фильтры"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
