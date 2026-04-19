'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';
import { TaskDetail, SubmissionAnswer } from '@/types';
import { cn } from '@/lib/utils';

interface ErrorFindTaskProps {
  task: TaskDetail;
  onSubmit: (answers: SubmissionAnswer) => Promise<void>;
  isSubmitting: boolean;
}

export function ErrorFindTask({ task, onSubmit, isSubmitting }: ErrorFindTaskProps) {
  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);

  const artifacts = task.artifacts || [];

  const handleToggleError = (id: string) => {
    setSelectedErrors((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const handleSubmit = async () => {
    await onSubmit({
      foundErrors: selectedErrors,
    });
  };

  return (
    <div className="space-y-6">
      {/* Что нужно сделать */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-medium text-amber-900">Инструкция</p>
            <p className="text-sm text-amber-800">
              Внимательно изучите данные и отметьте строки, содержащие ошибки в расчётах или
              логические несоответствия.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Тексты фрагментов — отмечаем ошибочные */}
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>{task.content}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {artifacts.map((artifact, idx) => (
              <Label
                key={artifact.id}
                htmlFor={artifact.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                  selectedErrors.includes(artifact.id)
                    ? 'border-destructive bg-destructive/5'
                    : 'hover:bg-muted/50'
                )}
              >
                <Checkbox
                  id={artifact.id}
                  checked={selectedErrors.includes(artifact.id)}
                  onCheckedChange={() => handleToggleError(artifact.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-muted text-xs font-medium">
                    {idx + 1}
                  </span>
                  <span className={cn(selectedErrors.includes(artifact.id) && 'text-destructive')}>
                    {artifact.text}
                  </span>
                </div>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Счётчик отмеченных и отправка */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Отмечено ошибок: {selectedErrors.length}</p>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Отправить ответ
        </Button>
      </div>
    </div>
  );
}
