'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecentSubmission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  status: string;
  score: number;
  maxScore: number;
  submittedAt: string;
}

interface DashboardData {
  totalClasses: number;
  totalStudents: number;
  pendingReviews: number;
  recentSubmissions: RecentSubmission[];
}

const statusLabels: Record<string, { label: string; className: string }> = {
  passed: { label: 'Принято', className: 'bg-green-100 text-green-800' },
  failed: { label: 'Не принято', className: 'bg-red-100 text-red-800' },
  manual_review: { label: 'На проверке', className: 'bg-yellow-100 text-yellow-800' },
  pending: { label: 'Ожидание', className: 'bg-gray-100 text-gray-800' },
};

export default function TeacherDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await apiClient.get<DashboardData>('/teacher/dashboard');
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-blue-600">{data?.totalClasses || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Классов</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-green-600">{data?.totalStudents || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Учеников</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-amber-600">{data?.pendingReviews || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Ожидают проверки</p>
            {(data?.pendingReviews || 0) > 0 && (
              <Link href="/teacher/reviews" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                Перейти к проверке
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Последние работы учеников</CardTitle>
            <Link href="/teacher/reviews">
              <Button variant="outline" size="sm">Все работы</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Ученик</th>
                    <th className="pb-2 font-medium">Задание</th>
                    <th className="pb-2 font-medium">Статус</th>
                    <th className="pb-2 font-medium">Балл</th>
                    <th className="pb-2 font-medium">Дата</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSubmissions.map((sub) => {
                    const st = statusLabels[sub.status] || statusLabels.pending;
                    return (
                      <tr key={sub.id} className="border-b last:border-0">
                        <td className="py-3">{sub.studentName}</td>
                        <td className="py-3">{sub.assignmentTitle}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded ${st.className}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="py-3">{sub.score}/{sub.maxScore}</td>
                        <td className="py-3 text-gray-500">
                          {new Date(sub.submittedAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="py-3">
                          <Link href={`/teacher/reviews/${sub.id}`}>
                            <Button size="sm" variant="outline">Проверить</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Нет работ для отображения</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
