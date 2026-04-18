'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout';
import { AuthGuard } from '@/components/layout/auth-guard';
import { useTaskStore } from '@/store';
import { formatDateTime, getScoreColor, getScoreBgColor } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

function ResultsContent() {
  const params = useParams();
  const submissionId = params.submissionId as string;

  const { lastResult, isLoading, fetchResult } = useTaskStore();

  useEffect(() => {
    if (submissionId) {
      fetchResult(submissionId);
    }
  }, [submissionId, fetchResult]);

  if (isLoading || !lastResult) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-3xl px-4 py-8">
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto mb-4 h-20 w-20 rounded-full" />
            <Skeleton className="mx-auto mb-2 h-8 w-48" />
            <Skeleton className="mx-auto h-5 w-64" />
          </div>
          <Skeleton className="mb-6 h-48 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </main>
      </div>
    );
  }

  const scorePercent = Math.round((lastResult.score / lastResult.maxScore) * 100);
  const isGoodScore = scorePercent >= 70;
  const isExcellentScore = scorePercent >= 90;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        {/* Крупно: балл и поздравление/подбадривание */}
        <div className="mb-8 text-center">
          <div
            className={cn(
              'mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full',
              isExcellentScore
                ? 'bg-emerald-100 text-emerald-600'
                : isGoodScore
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-rose-100 text-rose-600'
            )}
          >
            <Trophy className="h-12 w-12" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">
            {isExcellentScore ? 'Отлично!' : isGoodScore ? 'Хороший результат!' : 'Можно лучше!'}
          </h1>
          <p className="text-muted-foreground">{lastResult.taskTitle}</p>
        </div>

        {/* Карточка с цифрами по заданию */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-medium">Ваш результат</span>
              <span
                className={cn(
                  'text-3xl font-bold',
                  getScoreColor(lastResult.score, lastResult.maxScore)
                )}
              >
                {lastResult.score}/{lastResult.maxScore}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full transition-all',
                  getScoreBgColor(lastResult.score, lastResult.maxScore)
                )}
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Правильных ответов: {lastResult.feedback.correct} из {lastResult.feedback.total}
              </span>
              <span>{formatDateTime(lastResult.completedAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Разбор по пунктам */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Детальный разбор</CardTitle>
            <CardDescription>Посмотрите, какие вопросы были отвечены правильно</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lastResult.feedback.details.map((detail, idx) => (
                <div
                  key={detail.questionId}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    detail.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-rose-200 bg-rose-50/50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      detail.isCorrect
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-rose-100 text-rose-600'
                    )}
                  >
                    {detail.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">Вопрос {idx + 1}</span>
                    {!detail.isCorrect && detail.correctAnswer && (
                      <p className="text-sm text-muted-foreground">
                        Правильный ответ: {detail.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Кнопки: ещё раз или на главную */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/tasks/${lastResult.taskId}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              Пройти ещё раз
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />К списку заданий
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">
              Мой прогресс
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <AuthGuard>
      <ResultsContent />
    </AuthGuard>
  );
}
