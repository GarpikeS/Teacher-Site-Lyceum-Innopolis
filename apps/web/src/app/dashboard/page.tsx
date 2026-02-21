'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { User } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Trophy,
  Star,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Flame,
  Target,
  Zap,
} from 'lucide-react';

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

const activityIcons: Record<string, typeof BookOpen> = {
  submission: Code2,
  lesson: BookOpen,
  achievement: Trophy,
};

const activityColors: Record<string, string> = {
  submission: 'bg-indigo-50 text-indigo-600',
  lesson: 'bg-emerald-50 text-emerald-600',
  achievement: 'bg-amber-50 text-amber-600',
};

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Только что';
  if (diffMin < 60) return `${diffMin} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return new Date(timestamp).toLocaleDateString('ru-RU');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Загрузка...</span>
        </div>
      </div>
    );
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  })();

  const stats = [
    {
      label: 'Курсов',
      value: progress?.enrolledCourses || 0,
      icon: BookOpen,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderAccent: 'hover:border-indigo-200',
    },
    {
      label: 'Уроков пройдено',
      value: progress?.completedLessons || 0,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      borderAccent: 'hover:border-emerald-200',
    },
    {
      label: 'Заданий решено',
      value: progress?.passedAssignments || 0,
      icon: Target,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      borderAccent: 'hover:border-purple-200',
    },
    {
      label: 'Баллов',
      value: progress?.totalPoints || 0,
      icon: Star,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      borderAccent: 'hover:border-amber-200',
    },
  ];

  const quickActions = [
    {
      href: '/courses',
      icon: BookOpen,
      title: 'Каталог курсов',
      description: 'Выберите новый курс для изучения',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      hoverBorder: 'group-hover:border-indigo-200',
    },
    {
      href: '/courses',
      icon: Zap,
      title: 'Продолжить обучение',
      description: 'Вернитесь к последнему уроку',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      hoverBorder: 'group-hover:border-emerald-200',
    },
    {
      href: '/homework',
      icon: ClipboardCheck,
      title: 'Домашние задания',
      description: 'Проверьте текущие задания',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      hoverBorder: 'group-hover:border-purple-200',
    },
    {
      href: '/achievements',
      icon: Trophy,
      title: 'Достижения',
      description: 'Откройте новые награды',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      hoverBorder: 'group-hover:border-amber-200',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white shadow-soft">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <span className="text-sm text-indigo-200 font-medium">{greeting}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base max-w-lg">
            Продолжайте обучение и открывайте новые возможности. Каждый урок приближает вас к цели!
          </p>
          {progress && progress.totalPoints > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium">{progress.totalPoints} баллов</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                <span className="text-sm font-medium">{progress.completedLessons} уроков</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className={`rounded-2xl shadow-soft border border-slate-100 gradient-card transition-all duration-300 ${stat.borderAccent} hover:shadow-md animate-slide-up`}
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-3 rounded-2xl shadow-soft border border-slate-100">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Clock className="w-[18px] h-[18px] text-indigo-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Последняя активность
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {progress?.recentActivity && progress.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {progress.recentActivity.map((activity, index) => {
                  const IconComponent = activityIcons[activity.type] || BookOpen;
                  const colorClass = activityColors[activity.type] || 'bg-slate-50 text-slate-600';
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 animate-slide-up"
                      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {getTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Нет активности</p>
                <p className="text-xs text-slate-400 max-w-[240px]">
                  Начните изучение курса, и ваша активность появится здесь
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Zap className="w-[18px] h-[18px] text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Быстрые действия</h3>
          </div>

          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="block group">
                <Card
                  className={`rounded-2xl shadow-soft border border-slate-100 transition-all duration-300 ${action.hoverBorder} hover:shadow-md group-hover:-translate-y-0.5 animate-slide-up`}
                  style={{ animationDelay: `${(index + 2) * 80}ms`, animationFillMode: 'backwards' }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {action.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
