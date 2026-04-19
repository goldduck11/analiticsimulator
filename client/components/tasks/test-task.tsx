'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TaskDetail, SubmissionAnswer } from '@/types';
import { cn } from '@/lib/utils';

interface TestTaskProps {
  task: TaskDetail;
  onSubmit: (answers: SubmissionAnswer) => Promise<void>;
  isSubmitting: boolean;
}

export function TestTask({ task, onSubmit, isSubmitting }: TestTaskProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = task.questions || [];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    await onSubmit({
      questionId: JSON.stringify(answers),
    });
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Сколько вопросов из скольких */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Вопрос {currentQuestion + 1} из {totalQuestions}
        </span>
        <span className="text-sm font-medium">
          Отвечено: {answeredCount}/{totalQuestions}
        </span>
      </div>

      {/* Полоска прогресса по вопросам */}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Точки-переключатели между вопросами */}
      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(idx)}
            className={cn(
              'h-8 w-8 rounded-full text-sm font-medium transition-colors',
              idx === currentQuestion
                ? 'bg-primary text-primary-foreground'
                : answers[q.id]
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Текущий вопрос и варианты */}
      {currentQ && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            >
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={`${currentQ.id}-${option.id}`}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                      answers[currentQ.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <RadioGroupItem value={option.id} id={`${currentQ.id}-${option.id}`} />
                    <span>{option.text}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Назад / дальше или сдать */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Назад
        </Button>

        <div className="flex gap-2">
          {currentQuestion < totalQuestions - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={!answers[currentQ?.id]}
            >
              Далее
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isComplete || isSubmitting}>
              {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Завершить тест
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
