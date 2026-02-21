'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { HomeworkWithDetails } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Submission {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  language: string;
  status: string;
  score: number;
  maxScore: number;
  submittedAt: string;
}

export default function TeacherHomeworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.id as string;

  const [homework, setHomework] = useState<HomeworkWithDetails | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [homeworkId]);

  const loadData = async () => {
    try {
      const [hwRes, subRes] = await Promise.all([
        apiClient.get<HomeworkWithDetails>(`/homework/${homeworkId}`),
        apiClient.get<Submission[]>(`/homework/${homeworkId}/submissions`),
      ]);

      if (hwRes.success && hwRes.data) setHomework(hwRes.data);
      if (subRes.success && subRes.data) setSubmissions(subRes.data);
    } catch (error) {
      console.error('Failed to load homework data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'pending':
      case 'running': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'passed': return 'Сдано';
      case 'failed': return 'Ошибка';
      case 'pending': return 'Ожидает';
      case 'running': return 'Проверяется';
      case 'error': return 'Ошибка';
      default: return status;
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;
  if (!homework) return <div className="p-8">Задание не найдено</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-4 block">
        &larr; Назад к списку ДЗ
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{homework.title}</h1>
        <p className="text-gray-500 mt-1">Класс: {homework.className}</p>
        {homework.deadline && (
          <p className="text-sm text-gray-500 mt-1">
            Дедлайн: {new Date(homework.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{submissions.length}</div>
            <div className="text-sm text-gray-500">Сдано работ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'passed').length}
            </div>
            <div className="text-sm text-gray-500">Прошли тесты</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {submissions.length > 0
                ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length)
                : 0}
            </div>
            <div className="text-sm text-gray-500">Средний балл</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Задание</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium">{homework.assignmentTitle}</h3>
          <p className="text-sm text-gray-600 mt-1">{homework.assignmentDescription}</p>
          <div className="flex gap-4 text-sm text-gray-500 mt-2">
            <span className="capitalize">{homework.assignmentDifficulty}</span>
            <span>{homework.assignmentPoints} баллов</span>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mt-8 mb-4">Работы учеников ({submissions.length})</h2>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Пока никто не сдал работу
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{sub.firstName} {sub.lastName}</span>
                    <span className="text-sm text-gray-500 ml-2">{sub.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {sub.score || 0}/{sub.maxScore || homework.assignmentPoints} баллов
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(sub.status)}`}>
                      {getStatusLabel(sub.status)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(sub.submittedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="text-sm text-blue-600 cursor-pointer hover:underline">
                    Показать код
                  </summary>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded mt-2 text-sm overflow-auto max-h-64">
                    {sub.code}
                  </pre>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
