'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { CourseWithProgress } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await apiClient.get<CourseWithProgress[]>('/courses');
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Failed to load courses', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог курсов</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{course.title}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {course.language === 'python' ? 'Python' : 'C++'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{course.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Прогресс:</span>
                  <span className="font-medium">{course.progressPercentage?.toFixed(0) || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progressPercentage || 0}%` }} />
                </div>
                <p className="text-xs text-gray-500">
                  {course.completedLessons || 0} из {course.totalLessons || 0} уроков завершено
                </p>
              </div>
              <Link href={`/courses/${course.id}`}>
                <Button className="w-full">
                  {course.enrolledAt ? 'Продолжить' : 'Начать курс'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
