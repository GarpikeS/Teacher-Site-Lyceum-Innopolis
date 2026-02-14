'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PendingSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  code: string;
  language: string;
  status: string;
  score: number;
  maxScore: number;
  attemptNumber: number;
  createdAt: string;
  studentName: string;
  assignmentTitle: string;
}

export default function TeacherReviewsPage() {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await apiClient.get<PendingSubmission[]>('/submissions/pending-reviews');
      if (response.success && response.data) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error('Failed to load submissions', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Проверка работ</h1>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Нет работ, ожидающих проверки
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{submissions.length} работ ожидают проверки</p>
          {submissions.map((sub) => (
            <Card key={sub.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{sub.assignmentTitle}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Ученик: {sub.studentName}</span>
                      <span>Язык: {sub.language}</span>
                      <span>Попытка #{sub.attemptNumber}</span>
                      <span>{new Date(sub.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </div>
                  </div>
                  <Link href={`/teacher/reviews/${sub.id}`}>
                    <Button size="sm">Проверить</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
