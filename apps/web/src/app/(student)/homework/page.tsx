'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { HomeworkForStudent } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomeworkPage() {
  const [homework, setHomework] = useState<HomeworkForStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      const response = await apiClient.get<HomeworkForStudent[]>('/homework/my');
      if (response.success && response.data) {
        setHomework(response.data);
      }
    } catch (error) {
      console.error('Failed to load homework', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Не начато</span>;
    switch (status) {
      case 'passed': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Сдано</span>;
      case 'failed': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Ошибка</span>;
      case 'pending':
      case 'running': return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Проверяется</span>;
      default: return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{status}</span>;
    }
  };

  const getDeadlineStatus = (deadline?: Date) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return <span className="text-xs text-red-600 font-medium">Просрочено</span>;
    if (days === 0) return <span className="text-xs text-orange-600 font-medium">Сегодня</span>;
    if (days === 1) return <span className="text-xs text-orange-500 font-medium">Завтра</span>;
    return <span className="text-xs text-gray-500">Осталось {days} дн.</span>;
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Домашние задания</h1>

      {homework.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Домашних заданий пока нет
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {homework.map((hw) => (
            <Card key={hw.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{hw.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {hw.className} &middot; {hw.teacherFirstName} {hw.teacherLastName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(hw.submissionStatus)}
                    {getDeadlineStatus(hw.deadline)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Задание: {hw.assignmentTitle}</span>
                    <span className="capitalize">{hw.assignmentDifficulty}</span>
                    <span>{hw.assignmentPoints} баллов</span>
                  </div>
                  <Link href={`/homework/${hw.id}`}>
                    <Button size="sm">
                      {hw.submissionStatus === 'passed' ? 'Просмотреть' : 'Решить'}
                    </Button>
                  </Link>
                </div>
                {hw.deadline && (
                  <p className="text-xs text-gray-400 mt-2">
                    Дедлайн: {new Date(hw.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
