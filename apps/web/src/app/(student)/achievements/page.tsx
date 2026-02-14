'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AchievementWithStatus } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const criteriaLabels: Record<string, string> = {
  lessons_completed: 'Пройти уроков',
  assignments_completed: 'Решить заданий',
  perfect_score: 'Получить максимальный балл',
  course_completed: 'Завершить курсов',
  streak_days: 'Дней подряд',
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

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-2">Достижения</h2>
      <p className="text-gray-600 mb-6">
        Получено: {earned.length}/{achievements.length} | Баллов: {totalPoints}
      </p>

      {/* Earned achievements */}
      {earned.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Полученные</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {earned.map((achievement) => (
              <Card key={achievement.id} className="border-green-200 bg-green-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: achievement.badgeColor || '#22c55e' }}
                    >
                      {achievement.iconUrl || '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      {achievement.description && (
                        <p className="text-xs text-gray-600 mt-0.5">{achievement.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-green-700 font-medium">
                          +{achievement.points} баллов
                        </span>
                        {achievement.earnedAt && (
                          <span className="text-xs text-gray-400">
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
          <h3 className="text-lg font-semibold mb-4 text-gray-500">Доступные</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {locked.map((achievement) => (
              <Card key={achievement.id} className="border-gray-200 opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl shrink-0">
                      {achievement.iconUrl || '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      {achievement.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
                      )}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{criteriaLabels[achievement.criteria.type] || achievement.criteria.type}</span>
                          <span>
                            {achievement.progress || 0}/{achievement.progressTarget || achievement.criteria.count || 1}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 rounded-full h-2 transition-all"
                            style={{
                              width: `${Math.min(
                                ((achievement.progress || 0) / (achievement.progressTarget || achievement.criteria.count || 1)) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">
                        +{achievement.points} баллов
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Достижения пока не добавлены. Начните изучение курсов!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
