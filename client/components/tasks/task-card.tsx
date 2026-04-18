'use client';

import Link from 'next/link';
import { ListChecks, Search, PenLine, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task, TaskType, Difficulty } from '@/types';
import { getDifficultyLabel, getDifficultyColor, getTaskTypeLabel } from '@/lib/utils/formatters';

interface TaskCardProps {
  task: Task;
}

function getTaskIcon(type: TaskType) {
  switch (type) {
    case TaskType.TEST:
      return ListChecks;
    case TaskType.ERROR_FIND:
      return Search;
    case TaskType.OPEN:
      return PenLine;
    default:
      return ListChecks;
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const Icon = getTaskIcon(task.type);

  return (
    <Card className="group flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{getTaskTypeLabel(task.type)}</Badge>
            <Badge className={getDifficultyColor(task.difficulty)}>
              {getDifficultyLabel(task.difficulty)}
            </Badge>
          </div>
        </div>
        <CardTitle className="mt-3 text-lg">{task.title}</CardTitle>
        <CardDescription className="line-clamp-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <Link href={`/tasks/${task.id}`}>
          <Button className="w-full group-hover:bg-primary/90">
            Начать
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
