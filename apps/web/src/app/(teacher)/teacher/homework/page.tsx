'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeacherHomework {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  isPublished: boolean;
  classId: string;
  className: string;
  assignmentTitle: string;
  assignmentDifficulty: string;
  assignmentPoints: number;
  studentsCount: number;
  submissionsCount: number;
  createdAt: string;
}

export default function TeacherHomeworkPage() {
  const [homework, setHomework] = useState<TeacherHomework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      const response = await apiClient.get<TeacherHomework[]>('/homework/teacher');
      if (response.success && response.data) {
        setHomework(response.data);
      }
    } catch (error) {
      console.error('Failed to load homework', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить домашнее задание?')) return;
    try {
      await apiClient.delete(`/homework/${id}`);
      setHomework(hw => hw.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete homework', error);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Домашние задания</h1>
        <Link href="/teacher/homework/create">
          <Button>Создать ДЗ</Button>
        </Link>
      </div>

      {homework.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Домашних заданий пока нет. Создайте первое!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {homework.map((hw) => (
            <Card key={hw.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{hw.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Класс: {hw.className}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/teacher/homework/${hw.id}`}>
                      <Button size="sm" variant="outline">Просмотр</Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(hw.id)} className="text-red-600 hover:text-red-700">
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-gray-600">
                  <span>Задание: {hw.assignmentTitle}</span>
                  <span className="capitalize">{hw.assignmentDifficulty}</span>
                  <span>{hw.assignmentPoints} баллов</span>
                  <span>Сдано: {hw.submissionsCount}/{hw.studentsCount}</span>
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
