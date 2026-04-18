'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout';
import { AuthGuard } from '@/components/layout/auth-guard';
import { TestTask, ErrorFindTask, OpenTask } from '@/components/tasks';
import { useTaskStore } from '@/store';
import { TaskType, SubmissionAnswer } from '@/types';
import { getDifficultyLabel, getDifficultyColor, getTaskTypeLabel } from '@/lib/utils/formatters';

function TaskPageContent() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const { currentTask, isLoading, isSubmitting, error, fetchTask, submitTask, clearCurrentTask } =
    useTaskStore();

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
    return () => {
      clearCurrentTask();
    };
  }, [taskId, fetchTask, clearCurrentTask]);

  const handleSubmit = async (answers: SubmissionAnswer) => {
    try {
      const result = await submitTask(taskId, answers);
      router.push(`/results/${result.submissionId}`);
    } catch {
      // Ошибку покажет стор заданий; здесь не перехватываем молча
    }
  };

  if (isLoading || !currentTask) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="mb-4 h-10 w-32" />
          <Skeleton className="mb-2 h-8 w-2/3" />
          <Skeleton className="mb-8 h-5 w-1/2" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
          <h1 className="mb-4 text-2xl font-bold">Ошибка</h1>
          <p className="mb-8 text-muted-foreground">{error}</p>
          <Link href="/">
            <Button>Вернуться к списку</Button>
          </Link>
        </main>
      </div>
    );
  }

  const renderTaskContent = () => {
    switch (currentTask.type) {
      case TaskType.TEST:
        return <TestTask task={currentTask} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case TaskType.ERROR_FIND:
        return (
          <ErrorFindTask task={currentTask} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        );
      case TaskType.OPEN:
        return <OpenTask task={currentTask} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return <p>Неизвестный тип задания</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Назад к списку */}
        <Link href="/" className="mb-6 inline-block">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку
          </Button>
        </Link>

        {/* Шапка: название, тип, сложность */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{getTaskTypeLabel(currentTask.type)}</Badge>
            <Badge className={getDifficultyColor(currentTask.difficulty)}>
              {getDifficultyLabel(currentTask.difficulty)}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>~15 мин</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BarChart2 className="h-4 w-4" />
              <span>100 баллов</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{currentTask.title}</h1>
          <p className="mt-2 text-muted-foreground">{currentTask.description}</p>
        </div>

        {/* Сама форма задания */}
        {renderTaskContent()}
      </main>
    </div>
  );
}

export default function TaskPage() {
  return (
    <AuthGuard>
      <TaskPageContent />
    </AuthGuard>
  );
}
