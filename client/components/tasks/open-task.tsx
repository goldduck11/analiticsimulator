'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FileText, Info } from 'lucide-react';
import { TaskDetail, SubmissionAnswer } from '@/types';

interface OpenTaskProps {
  task: TaskDetail;
  onSubmit: (answers: SubmissionAnswer) => Promise<void>;
  isSubmitting: boolean;
}

export function OpenTask({ task, onSubmit, isSubmitting }: OpenTaskProps) {
  const [answer, setAnswer] = useState(task.artifactTemplate || '');

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 50;
  const isValid = wordCount >= minWords;

  const handleSubmit = async () => {
    await onSubmit({
      openAnswer: answer,
    });
  };

  return (
    <div className="space-y-6">
      {/* Условие / контекст (пока простой текст) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Условие задачи</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {task.content.split('\n').map((line, idx) => {
              if (line.startsWith('## ')) {
                return (
                  <h2 key={idx} className="mt-4 text-lg font-semibold">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={idx} className="font-medium">
                    {line.replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (line.startsWith('- ')) {
                return (
                  <p key={idx} className="ml-4">
                    {line}
                  </p>
                );
              }
              if (line.trim()) {
                return <p key={idx}>{line}</p>;
              }
              return <br key={idx} />;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Поле для развёрнутого ответа */}
      <Card>
        <CardHeader>
          <CardTitle>Ваш ответ</CardTitle>
          <CardDescription>Проанализируйте данные и напишите развёрнутый ответ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Введите ваш анализ..."
            className="min-h-[300px] font-mono text-sm"
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Минимум {minWords} слов для отправки</span>
            </div>
            <span className={wordCount >= minWords ? 'text-emerald-600' : 'text-muted-foreground'}>
              {wordCount} слов
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Отправить на проверку */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
          {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Отправить ответ
        </Button>
      </div>
    </div>
  );
}
