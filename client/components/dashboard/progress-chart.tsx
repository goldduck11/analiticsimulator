'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { HistoryItem } from '@/types';

interface ProgressChartProps {
  history: HistoryItem[];
}

export function ProgressChart({ history }: ProgressChartProps) {
  const chartData = history.slice(-7).map((item) => ({
    name: item.taskTitle.length > 15 ? item.taskTitle.slice(0, 15) + '...' : item.taskTitle,
    fullTitle: item.taskTitle,
    score: Math.round((item.score / item.maxScore) * 100),
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Результаты</CardTitle>
          <CardDescription>Последние выполненные задания</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Нет данных для отображения</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Результаты</CardTitle>
        <CardDescription>Последние выполненные задания</CardDescription>
      </CardHeader>
      <CardContent className="overflow-visible">
        <div className="h-[200px] w-full [&_.recharts-tooltip-wrapper]:z-50">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 16, right: 12, left: -12, bottom: 4 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                cursor={{ fill: 'color-mix(in oklch, var(--muted) 50%, transparent)' }}
                formatter={(value: number) => [`${value}%`, 'Результат']}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullTitle ?? payload?.[0]?.payload?.name ?? ''
                }
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 12px color-mix(in oklch, var(--foreground) 8%, transparent)',
                }}
                labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: 'var(--foreground)' }}
                allowEscapeViewBox={{ x: true, y: true }}
              />
              <Bar
                dataKey="score"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
