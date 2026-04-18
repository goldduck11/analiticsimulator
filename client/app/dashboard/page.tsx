'use client';

import { useEffect } from 'react';
import { Trophy, Target, CheckCircle2, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout';
import { AuthGuard } from '@/components/layout/auth-guard';
import { StatsCard, HistoryTable, ProgressChart } from '@/components/dashboard';
import { useProgressStore, useAuthStore } from '@/store';

function DashboardContent() {
  const { user } = useAuthStore();
  const { progress, isLoading, fetchProgress } = useProgressStore();

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="mb-8 h-5 w-96" />
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  const completionRate =
    progress.totalTasks > 0 ? Math.round((progress.completedTasks / progress.totalTasks) * 100) : 0;

  const averageScore =
    progress.history.length > 0
      ? Math.round(
          progress.history.reduce((acc, item) => acc + (item.score / item.maxScore) * 100, 0) /
            progress.history.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Верхняя полоса с меню */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Добро пожаловать, {user?.name?.split(' ')[0] || 'Аналитик'}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Отслеживайте свой прогресс и продолжайте развивать навыки
          </p>
        </div>

        {/* Три карточки со сводкой */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Общий балл"
            value={progress.totalScore}
            description="Накопленные баллы"
            icon={Trophy}
          />
          <StatsCard
            title="Выполнено заданий"
            value={`${progress.completedTasks}/${progress.totalTasks}`}
            description={`${completionRate}% завершено`}
            icon={CheckCircle2}
          />
          <StatsCard
            title="Средний результат"
            value={`${averageScore}%`}
            description="По всем заданиям"
            icon={Target}
            trend={averageScore > 70 ? { value: 5, isPositive: true } : undefined}
          />
          <StatsCard
            title="Активность"
            value={progress.history.length}
            description="Попыток за всё время"
            icon={TrendingUp}
          />
        </div>

        {/* График прогресса и таблица истории */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ProgressChart history={progress.history} />
          <div className="lg:col-span-2">
            <HistoryTable history={progress.history} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
