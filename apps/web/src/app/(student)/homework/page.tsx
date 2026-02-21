'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { HomeworkForStudent } from '@code-platform/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  User,
  Star,
  Flame,
  Zap,
  XCircle,
  Loader2,
  InboxIcon,
  Timer,
} from 'lucide-react';

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

  const stats = useMemo(() => {
    const total = homework.length;
    const completed = homework.filter((hw) => hw.submissionStatus === 'passed').length;
    const pending = homework.filter(
      (hw) => hw.submissionStatus === 'pending' || hw.submissionStatus === 'running'
    ).length;
    const expired = homework.filter((hw) => {
      if (!hw.deadline) return false;
      return new Date(hw.deadline).getTime() < Date.now() && hw.submissionStatus !== 'passed';
    }).length;
    return { total, completed, pending, expired };
  }, [homework]);

  const getDeadlineInfo = (deadline?: Date) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const hours = Math.ceil(diff / (1000 * 60 * 60));

    if (days < 0)
      return {
        text: 'Просрочено',
        className: 'text-red-600 bg-red-50',
        icon: AlertTriangle,
        urgent: true,
      };
    if (days === 0 && hours <= 0)
      return {
        text: 'Просрочено',
        className: 'text-red-600 bg-red-50',
        icon: AlertTriangle,
        urgent: true,
      };
    if (days === 0)
      return {
        text: `Сегодня (${hours} ч.)`,
        className: 'text-red-600 bg-red-50',
        icon: Flame,
        urgent: true,
      };
    if (days === 1)
      return {
        text: 'Завтра',
        className: 'text-amber-600 bg-amber-50',
        icon: Timer,
        urgent: true,
      };
    if (days <= 3)
      return {
        text: `${days} дн.`,
        className: 'text-amber-500 bg-amber-50',
        icon: Clock,
        urgent: false,
      };
    return {
      text: `${days} дн.`,
      className: 'text-slate-500 bg-slate-50',
      icon: Clock,
      urgent: false,
    };
  };

  const statusConfig: Record<
    string,
    {
      label: string;
      bg: string;
      text: string;
      dot: string;
      icon: typeof CheckCircle;
    }
  > = {
    passed: {
      label: 'Сдано',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      icon: CheckCircle,
    },
    failed: {
      label: 'Ошибка',
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      icon: XCircle,
    },
    pending: {
      label: 'Проверяется',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      icon: Loader2,
    },
    running: {
      label: 'Проверяется',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      icon: Loader2,
    },
  };

  const defaultStatus = {
    label: 'Не начато',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    icon: Clock,
  };

  const getDifficultyConfig = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'Легко', icon: Zap, className: 'text-emerald-600' };
      case 'medium':
        return { label: 'Средне', icon: Flame, className: 'text-amber-600' };
      case 'hard':
        return { label: 'Сложно', icon: Star, className: 'text-red-600' };
      default:
        return { label: difficulty || '', icon: Zap, className: 'text-slate-500' };
    }
  };

  const getStatusBadge = (status?: string) => {
    const config = status ? statusConfig[status] || defaultStatus : defaultStatus;
    const StatusIcon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${config.bg} ${config.text}`}
      >
        <StatusIcon
          className={`w-3 h-3 ${status === 'pending' || status === 'running' ? 'animate-spin' : ''}`}
        />
        {config.label}
      </span>
    );
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

  // Sort: urgent first, then by deadline
  const sortedHomework = useMemo(() => {
    return [...homework].sort((a, b) => {
      // Passed ones go to bottom
      if (a.submissionStatus === 'passed' && b.submissionStatus !== 'passed') return 1;
      if (a.submissionStatus !== 'passed' && b.submissionStatus === 'passed') return -1;
      // Then sort by deadline (earliest first)
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });
  }, [homework]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Skeleton header */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-72 mb-3" />
          <div className="h-5 bg-slate-100 rounded-lg w-96" />
        </div>
        {/* Skeleton stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-200" />
                <div>
                  <div className="h-6 bg-slate-200 rounded w-10 mb-1" />
                  <div className="h-3 bg-slate-100 rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-5 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-64 mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-48 mb-3" />
                  <div className="flex gap-3">
                    <div className="h-6 bg-slate-100 rounded-lg w-20" />
                    <div className="h-6 bg-slate-100 rounded-lg w-24" />
                  </div>
                </div>
                <div className="h-9 bg-slate-200 rounded-xl w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Домашние задания</h1>
            <p className="text-sm text-slate-500">
              Отслеживайте и выполняйте задания от преподавателей
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Всего</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              <p className="text-xs text-slate-500">Сдано</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              <p className="text-xs text-slate-500">На проверке</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.expired}</p>
              <p className="text-xs text-slate-500">Просрочено</p>
            </div>
          </div>
        </div>
      </div>

      {/* Homework list */}
      {homework.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <InboxIcon className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            Домашних заданий пока нет
          </h3>
          <p className="text-sm text-slate-500">
            Задания от преподавателей появятся здесь
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedHomework.map((hw, index) => {
            const deadlineInfo = getDeadlineInfo(hw.deadline);
            const diffConfig = getDifficultyConfig(hw.assignmentDifficulty);
            const DiffIcon = diffConfig.icon;
            const isPassed = hw.submissionStatus === 'passed';
            const isExpired =
              hw.deadline &&
              new Date(hw.deadline).getTime() < Date.now() &&
              !isPassed;

            return (
              <Card
                key={hw.id}
                className={`group rounded-2xl border shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-slide-up ${
                  isPassed
                    ? 'border-emerald-100 bg-emerald-50/30'
                    : isExpired
                      ? 'border-red-100 bg-red-50/20'
                      : 'border-slate-100'
                }`}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                {/* Color accent top stripe */}
                <div
                  className={`h-1 ${
                    isPassed
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : isExpired
                        ? 'bg-gradient-to-r from-red-500 to-orange-400'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                />

                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {hw.title}
                        </h3>
                        {getStatusBadge(hw.submissionStatus)}
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-sm text-slate-500">
                          <User className="w-3.5 h-3.5" />
                          {hw.teacherFirstName} {hw.teacherLastName}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-500">{hw.className}</span>
                      </div>

                      {/* Tags row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Assignment name */}
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                          {hw.assignmentTitle}
                        </span>

                        {/* Difficulty */}
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-slate-50 ${diffConfig.className}`}
                        >
                          <DiffIcon className="w-3 h-3" />
                          {diffConfig.label}
                        </span>

                        {/* Points */}
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-purple-50 text-purple-700">
                          <Star className="w-3 h-3" />
                          {hw.assignmentPoints} баллов
                        </span>

                        {/* Deadline countdown */}
                        {deadlineInfo && !isPassed && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${deadlineInfo.className}`}
                          >
                            <deadlineInfo.icon className="w-3 h-3" />
                            {deadlineInfo.text}
                          </span>
                        )}

                        {/* Score if passed */}
                        {isPassed && hw.submissionScore !== undefined && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                            <CheckCircle className="w-3 h-3" />
                            {hw.submissionScore} баллов
                          </span>
                        )}
                      </div>

                      {/* Deadline full date */}
                      {hw.deadline && (
                        <p className="flex items-center gap-1 text-xs text-slate-400 mt-2.5">
                          <CalendarClock className="w-3 h-3" />
                          Дедлайн:{' '}
                          {new Date(hw.deadline).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>

                    {/* Right: action button */}
                    <div className="shrink-0 self-center">
                      <Link href={`/homework/${hw.id}`}>
                        <Button
                          className={`rounded-xl group/btn transition-all duration-200 ${
                            isPassed
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : isExpired
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                : ''
                          }`}
                          variant={isPassed || isExpired ? 'outline' : 'default'}
                          size="sm"
                        >
                          <span>{isPassed ? 'Просмотреть' : 'Решить'}</span>
                          <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
