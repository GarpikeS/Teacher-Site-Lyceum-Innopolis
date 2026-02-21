'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Achievement } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Award,
  Plus,
  Save,
  X,
  Pencil,
  Trash2,
  Hash,
  Type,
  FileText,
  Star,
  Target,
  Palette,
  Loader2,
  Trophy,
  Flame,
  BookOpen,
  CheckCircle,
  Zap,
} from 'lucide-react';

const criteriaTypes = [
  { value: 'lessons_completed', label: 'Пройти уроков', icon: BookOpen },
  { value: 'assignments_completed', label: 'Решить заданий', icon: CheckCircle },
  { value: 'perfect_score', label: 'Максимальный балл', icon: Star },
  { value: 'course_completed', label: 'Завершить курсов', icon: Trophy },
  { value: 'streak_days', label: 'Дней подряд', icon: Flame },
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

  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-44 bg-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                  <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-64 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Достижения</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-[52px]">
            Управление системой достижений и наград
          </p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className={`rounded-xl gap-2 shadow-lg ${
            showForm
              ? 'bg-slate-600 hover:bg-slate-700 text-white shadow-slate-500/25'
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/25'
          }`}
        >
          {showForm ? (
            <><X className="w-4 h-4" /> Отмена</>
          ) : (
            <><Plus className="w-4 h-4" /> Добавить достижение</>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Всего</p>
              <p className="text-xl font-bold text-slate-800">{achievements.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Сумма баллов</p>
              <p className="text-xl font-bold text-slate-800">{totalPoints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Ср. баллов</p>
              <p className="text-xl font-bold text-slate-800">
                {achievements.length ? Math.round(totalPoints / achievements.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {editingId ? (
                <Pencil className="w-4 h-4 text-amber-500" />
              ) : (
                <Plus className="w-4 h-4 text-red-500" />
              )}
              <h2 className="text-sm font-semibold text-slate-700">
                {editingId ? 'Редактировать достижение' : 'Новое достижение'}
              </h2>
            </div>
            <button onClick={resetForm} className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    Slug
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="first-lesson"
                    required
                    disabled={!!editingId}
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Type className="w-3.5 h-3.5 text-slate-400" />
                    Название
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Первый шаг"
                    required
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Описание
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Пройдите свой первый урок"
                  className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    Иконка (emoji)
                  </label>
                  <Input
                    value={formData.iconUrl}
                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                    placeholder="&#x1F3C6;"
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Palette className="w-3.5 h-3.5 text-slate-400" />
                    Цвет бейджа
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="color"
                        value={formData.badgeColor}
                        onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                      />
                    </div>
                    <Input
                      value={formData.badgeColor}
                      onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                      className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Target className="w-3.5 h-3.5 text-slate-400" />
                    Тип критерия
                  </label>
                  <select
                    value={formData.criteriaType}
                    onChange={(e) => setFormData({ ...formData, criteriaType: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
                  >
                    {criteriaTypes.map((ct) => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    Количество
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.criteriaCount}
                    onChange={(e) => setFormData({ ...formData, criteriaCount: parseInt(e.target.value) || 1 })}
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Star className="w-3.5 h-3.5 text-slate-400" />
                    Баллы
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-3">Предпросмотр</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
                    style={{ backgroundColor: formData.badgeColor + '20', borderColor: formData.badgeColor, borderWidth: '2px' }}
                  >
                    {formData.iconUrl || '&#x1F3C6;'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{formData.title || 'Название достижения'}</h4>
                    <p className="text-xs text-slate-500">
                      {formData.description || 'Описание достижения'} &middot; {formData.points} баллов
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 rounded-xl gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Сохранить' : 'Создать'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="rounded-xl border-slate-200 hover:bg-slate-50"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievements list */}
      <div className="space-y-3">
        {achievements.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-12 text-center animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Нет достижений</h3>
            <p className="text-sm text-slate-500 mb-4">
              Создайте первое достижение для мотивации учеников
            </p>
          </div>
        )}

        {achievements.map((achievement, index) => {
          const CriteriaIcon = criteriaTypes.find((c) => c.value === achievement.criteria.type)?.icon || Target;
          const criteriaLabel = criteriaTypes.find((c) => c.value === achievement.criteria.type)?.label || achievement.criteria.type;

          return (
            <div
              key={achievement.id}
              className="group bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-md hover:border-slate-200 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Badge */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-lg"
                    style={{
                      backgroundColor: (achievement.badgeColor || '#3b82f6') + '15',
                      borderColor: achievement.badgeColor || '#3b82f6',
                      borderWidth: '2px',
                    }}
                  >
                    {achievement.iconUrl || '&#x1F3C6;'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{achievement.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{achievement.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Star className="w-3 h-3" />
                        {achievement.points} баллов
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <CriteriaIcon className="w-3 h-3" />
                        {criteriaLabel}: {achievement.criteria.count || 1}
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                        {achievement.slug}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(achievement)}
                      className="rounded-xl gap-1.5 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors text-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(achievement.id, achievement.title)}
                      className="rounded-xl gap-1.5 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
