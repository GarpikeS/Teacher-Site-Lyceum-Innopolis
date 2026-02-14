'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Course, LessonWithProgress } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseRes, lessonsRes, enrollmentRes] = await Promise.all([
        apiClient.get<Course>(`/courses/${courseId}`),
        apiClient.get<LessonWithProgress[]>(`/lessons/courses/${courseId}/lessons`),
        apiClient.get(`/courses/${courseId}/enrollment`).catch(() => null),
      ]);

      if (courseRes.success && courseRes.data) setCourse(courseRes.data);
      if (lessonsRes.success && lessonsRes.data) setLessons(lessonsRes.data);
      if (enrollmentRes?.success && enrollmentRes?.data) setIsEnrolled(true);
    } catch (error) {
      console.error('Failed to load course', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await apiClient.post(`/courses/${courseId}/enroll`);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Failed to enroll', error);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;
  if (!course) return <div className="p-8">Курс не найден</div>;

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершён';
      case 'in_progress': return 'В процессе';
      default: return 'Не начат';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.push('/courses')} className="text-blue-600 hover:underline mb-4 block">
        &larr; Назад к курсам
      </button>

      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {course.language === 'python' ? 'Python' : 'C++'}
            </span>
          </div>
          {!isEnrolled && (
            <Button onClick={handleEnroll}>Записаться на курс</Button>
          )}
        </div>
        {course.description && (
          <p className="text-gray-600">{course.description}</p>
        )}
        {course.estimatedHours && (
          <p className="text-sm text-gray-500 mt-2">
            Длительность: ~{course.estimatedHours} ч.
          </p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Уроки ({lessons.length})</h2>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <Card key={lesson.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-400 w-8">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-sm text-gray-500">{lesson.description}</p>
                    )}
                    {lesson.durationMinutes && (
                      <p className="text-xs text-gray-400">{lesson.durationMinutes} мин.</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded ${statusColor(lesson.status || 'not_started')}`}>
                    {statusLabel(lesson.status || 'not_started')}
                  </span>
                  {isEnrolled && (
                    <Link href={`/lessons/${lesson.id}`}>
                      <Button size="sm" variant={lesson.status === 'completed' ? 'outline' : 'default'}>
                        {lesson.status === 'completed' ? 'Повторить' : lesson.status === 'in_progress' ? 'Продолжить' : 'Начать'}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
