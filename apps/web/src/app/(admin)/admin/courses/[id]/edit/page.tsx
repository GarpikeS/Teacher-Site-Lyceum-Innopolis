'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api-client';
import { Course, UpdateCourseDto } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateCourseDto>();

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await apiClient.get<Course>(`/courses/${courseId}`);
      if (response.success && response.data) {
        reset({
          title: response.data.title,
          description: response.data.description || '',
          estimatedHours: response.data.estimatedHours,
          orderIndex: response.data.orderIndex,
          isPublished: response.data.isPublished,
        });
      }
    } catch (error) {
      console.error('Failed to load course', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdateCourseDto) => {
    setIsSaving(true);
    try {
      await apiClient.patch(`/courses/${courseId}`, data);
      router.push('/admin/courses');
    } catch (error: any) {
      alert(error.message || 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Редактировать курс</h1>
      <Card>
        <CardHeader><CardTitle>Информация о курсе</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Название</label>
              <Input {...register('title')} placeholder="Название курса" />
            </div>
            <div>
              <label className="text-sm font-medium">Описание</label>
              <textarea {...register('description')} className="w-full border rounded p-2" rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium">Порядок</label>
              <Input type="number" {...register('orderIndex', { valueAsNumber: true })} />
            </div>
            <div>
              <label className="text-sm font-medium">Часов (примерно)</label>
              <Input type="number" {...register('estimatedHours', { valueAsNumber: true })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPublished" {...register('isPublished')} className="rounded" />
              <label htmlFor="isPublished" className="text-sm font-medium">Опубликован</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
