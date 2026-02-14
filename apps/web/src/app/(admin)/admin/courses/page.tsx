'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Course } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await apiClient.get<Course[]>('/courses');
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Failed to load courses', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить курс?')) return;
    try {
      await apiClient.delete(`/courses/${id}`);
      loadCourses();
    } catch (error) {
      alert('Ошибка при удалении курса');
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Курсы</h1>
        <Link href="/admin/courses/create">
          <Button>Создать курс</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{course.title}</span>
                <div className="flex gap-2">
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Button size="sm" variant="outline">Редактировать</Button>
                  </Link>
                  <Link href={`/admin/courses/${course.id}/lessons`}>
                    <Button size="sm" variant="outline">Уроки</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(course.id)}>
                    Удалить
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{course.description}</p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {course.language}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {course.isPublished ? 'Опубликован' : 'Черновик'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
