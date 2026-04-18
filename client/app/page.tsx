'use client';

import { Header } from '@/components/layout';
import { TaskList } from '@/components/tasks';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Тренажёр аналитика</h1>
          <p className="mt-2 text-muted-foreground">
            Выберите задание для развития навыков анализа данных
          </p>
        </div>
        <TaskList />
      </main>
    </div>
  );
}
