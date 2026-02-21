'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Clock,
  ArrowRight,
  FileCheck,
  Inbox,
} from 'lucide-react';

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
  passed: { label: 'Принято', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  failed: { label: 'Не принято', className: 'bg-red-50 text-red-700 border border-red-200' },
  manual_review: { label: 'На проверке', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  pending: { label: 'Ожидание', className: 'bg-slate-50 text-slate-600 border border-slate-200' },
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header skeleton */}
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl animate-pulse" />
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 space-y-4">
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Панель управления</h1>
            <p className="text-emerald-100 text-sm mt-0.5">Обзор вашей образовательной деятельности</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 hover:shadow-md transition-all duration-300 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{data?.totalClasses || 0}</p>
              <p className="text-sm text-slate-500 mt-0.5">Классов</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{data?.totalStudents || 0}</p>
              <p className="text-sm text-slate-500 mt-0.5">Учеников</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{data?.pendingReviews || 0}</p>
              <p className="text-sm text-slate-500 mt-0.5">Ожидают проверки</p>
            </div>
          </div>
          {(data?.pendingReviews || 0) > 0 && (
            <Link
              href="/teacher/reviews"
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mt-3 font-medium group"
            >
              Перейти к проверке
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">Последние работы учеников</h2>
          </div>
          <Link href="/teacher/reviews">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              Все работы
            </Button>
          </Link>
        </div>
        <div className="p-6 pt-0">
          {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider">Ученик</th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider">Задание</th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider">Статус</th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider">Балл</th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider">Дата</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentSubmissions.map((sub) => {
                    const st = statusLabels[sub.status] || statusLabels.pending;
                    return (
                      <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-2">
                          <span className="font-medium text-slate-700">{sub.studentName}</span>
                        </td>
                        <td className="py-3.5 px-2 text-slate-600">{sub.assignmentTitle}</td>
                        <td className="py-3.5 px-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.className}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className="font-medium text-slate-700">{sub.score}</span>
                          <span className="text-slate-400">/{sub.maxScore}</span>
                        </td>
                        <td className="py-3.5 px-2 text-slate-400">
                          {new Date(sub.submittedAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="py-3.5 px-2">
                          <Link href={`/teacher/reviews/${sub.id}`}>
                            <Button size="sm" variant="outline" className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 opacity-0 group-hover:opacity-100 transition-all">
                              Проверить
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Inbox className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Нет работ для отображения</p>
              <p className="text-slate-400 text-sm mt-1">Работы учеников появятся здесь после отправки</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
