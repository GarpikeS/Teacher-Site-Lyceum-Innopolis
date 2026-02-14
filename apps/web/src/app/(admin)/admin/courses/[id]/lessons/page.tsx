'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Course, Lesson, CreateLessonDto } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => router.push('/admin/courses')} className="text-blue-600 hover:underline text-sm">
            &larr; Назад к курсам
          </button>
          <h1 className="text-3xl font-bold mt-2">
            Уроки: {course?.title}
          </h1>
        </div>
        <Button onClick={handleCreate}>Добавить урок</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingLesson ? 'Редактировать урок' : 'Новый урок'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(d => ({ ...d, slug: e.target.value }))}
                    placeholder="lesson-slug"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Название</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(d => ({ ...d, title: e.target.value }))}
                    placeholder="Название урока"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
                  className="w-full border rounded p-2"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Содержимое (HTML)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(d => ({ ...d, content: e.target.value }))}
                  className="w-full border rounded p-2 font-mono text-sm"
                  rows={10}
                  placeholder="<h2>Введение</h2><p>...</p>"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Порядок</label>
                  <Input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData(d => ({ ...d, orderIndex: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Длительность (мин)</label>
                  <Input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData(d => ({ ...d, durationMinutes: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Сохранение...' : editingLesson ? 'Сохранить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Отмена</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {lessons.length === 0 && !showForm && (
          <p className="text-gray-500 text-center py-8">Нет уроков. Нажмите "Добавить урок" для создания.</p>
        )}
        {lessons.map((lesson, index) => (
          <Card key={lesson.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-400 w-8">{index + 1}</span>
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-xs text-gray-500">
                      {lesson.slug} | {lesson.durationMinutes || '?'} мин.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs px-2 py-1 rounded ${lesson.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {lesson.isPublished ? 'Опубликован' : 'Черновик'}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => handleTogglePublish(lesson)}>
                    {lesson.isPublished ? 'Скрыть' : 'Опубликовать'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(lesson)}>
                    Редактировать
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(lesson.id)}>
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
