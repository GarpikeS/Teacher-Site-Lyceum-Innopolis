'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { User } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressData {
  enrolledCourses: number;
  completedLessons: number;
  passedAssignments: number;
  earnedAchievements: number;
  totalPoints: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);

        // Redirect admin to admin panel
        if (currentUser.role === 'admin') {
          router.push('/admin/courses');
          return;
        }

        // Redirect teacher to teacher panel
        if (currentUser.role === 'teacher') {
          router.push('/teacher/dashboard');
          return;
        }

        // Load progress for students
        try {
          const progressRes = await apiClient.get<ProgressData>('/progress/me');
          if (progressRes.success && progressRes.data) {
            setProgress(progressRes.data);
          }
        } catch {
          // Progress endpoint may not be available yet
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <h1 className="text-2xl font-bold">Code Platform</h1>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              <Link href="/courses" className="text-gray-600 hover:text-gray-900">Курсы</Link>
            </nav>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</span>
            <Button onClick={handleLogout} variant="outline">Выйти</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-6">
          Добро пожаловать, {user?.firstName}!
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{progress?.enrolledCourses || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Курсов</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{progress?.completedLessons || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Уроков пройдено</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{progress?.passedAssignments || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Заданий решено</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{progress?.totalPoints || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Баллов</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Последняя активность</CardTitle>
            </CardHeader>
            <CardContent>
              {progress?.recentActivity && progress.recentActivity.length > 0 ? (
                <ul className="space-y-3">
                  {progress.recentActivity.map((activity) => (
                    <li key={activity.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          activity.type === 'submission' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        {activity.title}
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(activity.timestamp).toLocaleDateString('ru-RU')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Нет активности. Начните изучение курса!</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/courses" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Каталог курсов
                </Button>
              </Link>
              <Link href="/courses" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Продолжить обучение
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
