'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AchievementWithStatus } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Trophy,
  Lock,
  Star,
  Sparkles,
  Target,
  Flame,
  Award,
  Zap,
  CheckCircle,
} from 'lucide-react';

const criteriaLabels: Record<string, string> = {
  lessons_completed: 'Пройти уроков',
  assignments_completed: 'Решить заданий',
  perfect_score: 'Получить максимальный балл',
  course_completed: 'Завершить курсов',
  streak_days: 'Дней подряд',
};

const achievementEmojis: Record<string, string> = {
  lessons_completed: '📚',
  assignments_completed: '💻',
  perfect_score: '💯',
  course_completed: '🎓',
  streak_days: '🔥',
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      // First check for new achievements
      await apiClient.post('/achievements/check').catch(() => {});

      const res = await apiClient.get<AchievementWithStatus[]>('/achievements');
      if (res.success && res.data) {
        setAchievements(res.data);
      }
    } catch (error) {
      console.error('Failed to load achievements', error);
    } finally {
      setIsLoading(false);
    }
  };

  const earned = achievements.filter((a) => a.isEarned);
  const locked = achievements.filter((a) => !a.isEarned);
  const totalPoints = earned.reduce((sum, a) => sum + a.points, 0);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Skeleton header */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-64 mb-3" />
          <div className="h-5 bg-slate-100 rounded-lg w-96" />
        </div>
        {/* Skeleton stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="h-10 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-48" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Достижения</h1>
            <p className="text-sm text-slate-500">
              Ваш прогресс и награды за обучение
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{earned.length}</p>
              <p className="text-xs text-slate-500">Получено</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{locked.length}</p>
              <p className="text-xs text-slate-500">Доступно</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalPoints}</p>
              <p className="text-xs text-slate-500">Баллов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earned achievements */}
      {earned.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Полученные</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700">
              {earned.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {earned.map((achievement, index) => (
              <Card
                key={achievement.id}
                className="group rounded-2xl border border-emerald-100 shadow-soft bg-gradient-to-br from-white to-emerald-50/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                      style={{
                        backgroundColor: achievement.badgeColor || '#22c55e',
                        color: 'white',
                      }}
                    >
                      {achievement.iconUrl || achievementEmojis[achievement.criteria.type] || '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {achievement.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                          <Sparkles className="w-3 h-3" />
                          +{achievement.points} баллов
                        </span>
                        {achievement.earnedAt && (
                          <span className="text-xs text-slate-400">
                            {new Date(achievement.earnedAt).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked achievements */}
      {locked.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Доступные</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
              {locked.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {locked.map((achievement, index) => {
              const progress = achievement.progress || 0;
              const target = achievement.progressTarget || achievement.criteria.count || 1;
              const percentage = Math.min((progress / target) * 100, 100);

              return (
                <Card
                  key={achievement.id}
                  className="group rounded-2xl border border-slate-100 shadow-soft bg-white hover:shadow-md transition-all duration-300 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${(earned.length + index) * 0.05}s` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:bg-slate-200 transition-colors">
                        {achievement.iconUrl || achievementEmojis[achievement.criteria.type] || '🔒'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-700">
                          {achievement.title}
                        </h3>
                        {achievement.description && (
                          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {achievement.description}
                          </p>
                        )}

                        {/* Progress section */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-500">
                              {criteriaLabels[achievement.criteria.type] || achievement.criteria.type}
                            </span>
                            <span className="font-semibold text-slate-600">
                              {progress}/{target}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-indigo-500 to-purple-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-2">
                          <Zap className="w-3 h-3" />
                          +{achievement.points} баллов
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            Достижения пока не добавлены
          </h3>
          <p className="text-sm text-slate-500">
            Начните изучение курсов, чтобы получить свои первые награды!
          </p>
        </div>
      )}
    </div>
  );
}
