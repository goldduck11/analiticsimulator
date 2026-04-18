'use client';

import Link from 'next/link';
import { ListChecks, Search, PenLine, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryItem, TaskType } from '@/types';
import { formatDate, getScoreColor } from '@/lib/utils/formatters';

interface HistoryTableProps {
  history: HistoryItem[];
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

export function HistoryTable({ history }: HistoryTableProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>История выполнения</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Вы ещё не выполнили ни одного задания</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>История выполнения</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Задание</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Результат</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item, idx) => {
              const Icon = getTaskIcon(item.taskType);
              const scorePercent = Math.round((item.score / item.maxScore) * 100);

              return (
                <TableRow key={`${item.taskId}-${idx}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.taskTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.taskType === TaskType.TEST && 'Тест'}
                      {item.taskType === TaskType.ERROR_FIND && 'Поиск ошибок'}
                      {item.taskType === TaskType.OPEN && 'Открытый'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={getScoreColor(item.score, item.maxScore)}>
                      {item.score}/{item.maxScore}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">({scorePercent}%)</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <Link href={`/tasks/${item.taskId}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
