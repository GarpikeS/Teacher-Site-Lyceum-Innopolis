'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api-client';
import { Course, UpdateCourseDto } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pencil,
  ArrowLeft,
  Save,
  Type,
  FileText,
  ListOrdered,
  Clock,
  Eye,
  Loader2,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
          <div className="space-y-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.push('/admin/courses')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Назад к курсам
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
          <Pencil className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Редактировать курс</h1>
          <p className="text-sm text-slate-500">Измените информацию о курсе</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-700">Информация о курсе</h2>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Type className="w-3.5 h-3.5 text-slate-400" />
                Название
              </label>
              <Input
                {...register('title')}
                placeholder="Название курса"
                className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Описание
              </label>
              <textarea
                {...register('description')}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all resize-none"
                rows={4}
                placeholder="Описание курса..."
              />
            </div>

            {/* Order & Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
                  Порядок
                </label>
                <Input
                  type="number"
                  {...register('orderIndex', { valueAsNumber: true })}
                  className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Часов (примерно)
                </label>
                <Input
                  type="number"
                  {...register('estimatedHours', { valueAsNumber: true })}
                  className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                />
              </div>
            </div>

            {/* Published checkbox */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <input
                type="checkbox"
                id="isPublished"
                {...register('isPublished')}
                className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500/20"
              />
              <div>
                <label htmlFor="isPublished" className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <Eye className="w-4 h-4 text-slate-400" />
                  Опубликован
                </label>
                <p className="text-xs text-slate-500 mt-0.5">Курс будет виден ученикам</p>
              </div>
            </div>

            {/* Actions */}
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
                    Сохранить
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-xl border-slate-200 hover:bg-slate-50"
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
