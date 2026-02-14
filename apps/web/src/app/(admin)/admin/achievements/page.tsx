'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Achievement } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const criteriaTypes = [
  { value: 'lessons_completed', label: 'Пройти уроков' },
  { value: 'assignments_completed', label: 'Решить заданий' },
  { value: 'perfect_score', label: 'Максимальный балл' },
  { value: 'course_completed', label: 'Завершить курсов' },
  { value: 'streak_days', label: 'Дней подряд' },
];

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    iconUrl: '',
    badgeColor: '#3b82f6',
    criteriaType: 'lessons_completed',
    criteriaCount: 1,
    points: 10,
  });

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const res = await apiClient.get<Achievement[]>('/achievements');
      if (res.success && res.data) {
        setAchievements(res.data);
      }
    } catch (error) {
      console.error('Failed to load achievements', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      iconUrl: '',
      badgeColor: '#3b82f6',
      criteriaType: 'lessons_completed',
      criteriaCount: 1,
      points: 10,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      slug: achievement.slug,
      title: achievement.title,
      description: achievement.description || '',
      iconUrl: achievement.iconUrl || '',
      badgeColor: achievement.badgeColor || '#3b82f6',
      criteriaType: achievement.criteria.type,
      criteriaCount: achievement.criteria.count || 1,
      points: achievement.points,
    });
    setEditingId(achievement.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      slug: formData.slug,
      title: formData.title,
      description: formData.description || undefined,
      iconUrl: formData.iconUrl || undefined,
      badgeColor: formData.badgeColor,
      criteria: {
        type: formData.criteriaType,
        count: formData.criteriaCount,
      },
      points: formData.points,
    };

    try {
      if (editingId) {
        await apiClient.patch(`/achievements/${editingId}`, payload);
      } else {
        await apiClient.post('/achievements', payload);
      }
      resetForm();
      loadAchievements();
    } catch (error) {
      console.error('Failed to save achievement', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить достижение "${title}"?`)) return;
    try {
      await apiClient.delete(`/achievements/${id}`);
      loadAchievements();
    } catch (error) {
      console.error('Failed to delete achievement', error);
    }
  };

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Достижения ({achievements.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Отмена' : 'Добавить достижение'}
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Редактировать достижение' : 'Новое достижение'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="first-lesson"
                  required
                  disabled={!!editingId}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Первый шаг"
                  required
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium">Описание</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Пройдите свой первый урок"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Иконка (emoji)</label>
                <Input
                  value={formData.iconUrl}
                  onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                  placeholder="🏆"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Цвет бейджа</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.badgeColor}
                    onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={formData.badgeColor}
                    onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Тип критерия</label>
                <select
                  value={formData.criteriaType}
                  onChange={(e) => setFormData({ ...formData, criteriaType: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {criteriaTypes.map((ct) => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Количество</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.criteriaCount}
                  onChange={(e) => setFormData({ ...formData, criteriaCount: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Баллы</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit">{editingId ? 'Сохранить' : 'Создать'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Отмена</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Achievements list */}
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: achievement.badgeColor || '#3b82f6' }}
                  >
                    {achievement.iconUrl || '🏆'}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{achievement.title}</h3>
                    <p className="text-xs text-gray-500">
                      {achievement.description} | {achievement.points} баллов |{' '}
                      {criteriaTypes.find((c) => c.value === achievement.criteria.type)?.label}: {achievement.criteria.count || 1}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(achievement)}>
                    Изменить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(achievement.id, achievement.title)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Достижения пока не созданы
          </CardContent>
        </Card>
      )}
    </div>
  );
}
