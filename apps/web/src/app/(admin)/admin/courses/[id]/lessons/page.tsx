'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Course, Lesson, CreateLessonDto } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Save,
  X,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Hash,
  Type,
  FileText,
  Code2,
  ListOrdered,
  Clock,
  Loader2,
  GripVertical,
  FileCode,
  Layers,
} from 'lucide-react';

export default function AdminCourseLessonsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    content: '',
    orderIndex: 0,
    durationMinutes: 30,
  });

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        apiClient.get<Course>(`/courses/${courseId}`),
        apiClient.get<Lesson[]>(`/lessons/courses/${courseId}/lessons`),
      ]);
      if (courseRes.success && courseRes.data) setCourse(courseRes.data);
      if (lessonsRes.success && lessonsRes.data) setLessons(lessonsRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ slug: '', title: '', description: '', content: '', orderIndex: lessons.length + 1, durationMinutes: 30 });
    setEditingLesson(null);
    setShowForm(false);
  };

  const handleCreate = () => {
    setFormData({ slug: '', title: '', description: '', content: '', orderIndex: lessons.length + 1, durationMinutes: 30 });
    setEditingLesson(null);
    setShowForm(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setFormData({
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      orderIndex: lesson.orderIndex,
      durationMinutes: lesson.durationMinutes || 30,
    });
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingLesson) {
        await apiClient.patch(`/lessons/${editingLesson.id}`, formData);
      } else {
        await apiClient.post('/lessons', { ...formData, courseId });
      }
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.message || 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить урок?')) return;
    try {
      await apiClient.delete(`/lessons/${id}`);
      loadData();
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const handleTogglePublish = async (lesson: Lesson) => {
    try {
      await apiClient.patch(`/lessons/${lesson.id}`, { isPublished: !lesson.isPublished });
      loadData();
    } catch (error) {
      alert('Ошибка обновления');
    }
  };

  const publishedCount = lessons.filter((l) => l.isPublished).length;
  const totalMinutes = lessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-7 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-6 w-8 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-56 bg-slate-100 rounded animate-pulse" />
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
      {/* Back button */}
      <button
        onClick={() => router.push('/admin/courses')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Назад к курсам
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Уроки</h1>
            <p className="text-sm text-slate-500">{course?.title}</p>
          </div>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить урок
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Всего уроков</p>
              <p className="text-xl font-bold text-slate-800">{lessons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Опубликовано</p>
              <p className="text-xl font-bold text-slate-800">{publishedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Общее время</p>
              <p className="text-xl font-bold text-slate-800">{totalMinutes} мин</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {editingLesson ? (
                <Pencil className="w-4 h-4 text-amber-500" />
              ) : (
                <Plus className="w-4 h-4 text-red-500" />
              )}
              <h2 className="text-sm font-semibold text-slate-700">
                {editingLesson ? 'Редактировать урок' : 'Новый урок'}
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
                    onChange={(e) => setFormData(d => ({ ...d, slug: e.target.value }))}
                    placeholder="lesson-slug"
                    required
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Type className="w-3.5 h-3.5 text-slate-400" />
                    Название
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(d => ({ ...d, title: e.target.value }))}
                    placeholder="Название урока"
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
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all resize-none"
                  rows={2}
                  placeholder="Краткое описание урока..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <FileCode className="w-3.5 h-3.5 text-slate-400" />
                  Содержимое (HTML)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(d => ({ ...d, content: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all bg-slate-50"
                  rows={10}
                  placeholder="<h2>Введение</h2><p>...</p>"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
                    Порядок
                  </label>
                  <Input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData(d => ({ ...d, orderIndex: parseInt(e.target.value) || 0 }))}
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Длительность (мин)
                  </label>
                  <Input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData(d => ({ ...d, durationMinutes: parseInt(e.target.value) || 0 }))}
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 rounded-xl gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingLesson ? 'Сохранить' : 'Создать'}
                    </>
                  )}
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

      {/* Lessons list */}
      <div className="space-y-3">
        {lessons.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-12 text-center animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Нет уроков</h3>
            <p className="text-sm text-slate-500 mb-4">
              Нажмите &quot;Добавить урок&quot; для создания первого урока
            </p>
          </div>
        )}

        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="group bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-md hover:border-slate-200 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Number badge */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-slate-500">{index + 1}</span>
                  </div>
                  <div className="min-w-0 sm:hidden">
                    <h3 className="font-semibold text-slate-800 truncate">{lesson.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lesson.slug} &middot; {lesson.durationMinutes || '?'} мин.
                    </p>
                  </div>
                </div>

                {/* Info (desktop) */}
                <div className="flex-1 min-w-0 hidden sm:block">
                  <h3 className="font-semibold text-slate-800 truncate">{lesson.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {lesson.slug}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.durationMinutes || '?'} мин.
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    lesson.isPublished
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {lesson.isPublished ? 'Опубликован' : 'Черновик'}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePublish(lesson)}
                    className="rounded-xl gap-1.5 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors text-xs"
                  >
                    {lesson.isPublished ? (
                      <><EyeOff className="w-3.5 h-3.5" /> Скрыть</>
                    ) : (
                      <><Eye className="w-3.5 h-3.5" /> Опубликовать</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(lesson)}
                    className="rounded-xl gap-1.5 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors text-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Изменить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(lesson.id)}
                    className="rounded-xl gap-1.5 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
