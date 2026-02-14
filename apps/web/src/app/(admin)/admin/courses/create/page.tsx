'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api-client';
import { CreateCourseDto, ProgrammingLanguage } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Создать курс</h1>
      <Card>
        <CardHeader><CardTitle>Информация о курсе</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input {...register('slug', { required: true })} placeholder="python-advanced" />
              {errors.slug && <p className="text-sm text-red-600">Обязательное поле</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Название</label>
              <Input {...register('title', { required: true })} placeholder="Python Углубленный" />
              {errors.title && <p className="text-sm text-red-600">Обязательное поле</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Описание</label>
              <textarea {...register('description')} className="w-full border rounded p-2" rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium">Язык</label>
              <select {...register('language', { required: true })} className="w-full border rounded p-2">
                <option value="">Выберите язык</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
              {errors.language && <p className="text-sm text-red-600">Обязательное поле</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Порядок</label>
              <Input type="number" {...register('orderIndex', { required: true, valueAsNumber: true })} placeholder="1" />
              {errors.orderIndex && <p className="text-sm text-red-600">Обязательное поле</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Часов (примерно)</label>
              <Input type="number" {...register('estimatedHours', { valueAsNumber: true })} placeholder="20" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Создание...' : 'Создать курс'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
