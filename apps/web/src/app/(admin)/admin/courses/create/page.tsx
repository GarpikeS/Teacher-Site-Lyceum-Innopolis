'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api-client';
import { CreateCourseDto, ProgrammingLanguage } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  ArrowLeft,
  Save,
  X,
  Type,
  Hash,
  FileText,
  Code2,
  ListOrdered,
  Clock,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateCourseDto>();

  const onSubmit = async (data: CreateCourseDto) => {
    setIsLoading(true);
    try {
      await apiClient.post('/courses', data);
      router.push('/admin/courses');
    } catch (error: any) {
      alert(error.message || 'Ошибка создания курса');
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Создать курс</h1>
          <p className="text-sm text-slate-500">Заполните информацию о новом курсе</p>
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
            {/* Slug */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Slug
              </label>
              <Input
                {...register('slug', { required: true })}
                placeholder="python-advanced"
                className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
              />
              {errors.slug && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X className="w-3 h-3" /> Обязательное поле
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Type className="w-3.5 h-3.5 text-slate-400" />
                Название
              </label>
              <Input
                {...register('title', { required: true })}
                placeholder="Python Углубленный"
                className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
              />
              {errors.title && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X className="w-3 h-3" /> Обязательное поле
                </p>
              )}
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
                placeholder="Подробное описание курса..."
              />
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                Язык программирования
              </label>
              <select
                {...register('language', { required: true })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
              >
                <option value="">Выберите язык</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
              {errors.language && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X className="w-3 h-3" /> Обязательное поле
                </p>
              )}
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
                  {...register('orderIndex', { required: true, valueAsNumber: true })}
                  placeholder="1"
                  className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                />
                {errors.orderIndex && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <X className="w-3 h-3" /> Обязательное поле
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Часов (примерно)
                </label>
                <Input
                  type="number"
                  {...register('estimatedHours', { valueAsNumber: true })}
                  placeholder="20"
                  className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-500/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 rounded-xl gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Создать курс
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
