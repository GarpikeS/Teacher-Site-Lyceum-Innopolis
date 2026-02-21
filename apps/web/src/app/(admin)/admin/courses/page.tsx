'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Course } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ListOrdered,
  Eye,
  EyeOff,
  Code2,
  GraduationCap,
  Search,
  FileText,
  Clock,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCourses = courses.filter(
    (c) =>
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = courses.filter((c) => c.isPublished).length;
  const draftCount = courses.filter((c) => !c.isPublished).length;
  const pythonCount = courses.filter((c) => c.language === 'python').length;
  const cppCount = courses.filter((c) => c.language === 'cpp').length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
        {/* List skeleton */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-72 bg-slate-100 rounded animate-pulse" />
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
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Курсы</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-[52px]">
            Управление учебными курсами платформы
          </p>
        </div>
        <Link href="/admin/courses/create">
          <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            Создать курс
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Всего</p>
              <p className="text-xl font-bold text-slate-800">{courses.length}</p>
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
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Python</p>
              <p className="text-xl font-bold text-slate-800">{pythonCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">C++</p>
              <p className="text-xl font-bold text-slate-800">{cppCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Поиск по названию или описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all shadow-soft"
        />
      </div>

      {/* Course list */}
      <div className="space-y-3">
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-12 text-center animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              {searchQuery ? 'Ничего не найдено' : 'Нет курсов'}
            </h3>
            <p className="text-sm text-slate-500">
              {searchQuery
                ? 'Попробуйте изменить поисковый запрос'
                : 'Создайте первый курс для начала работы'}
            </p>
          </div>
        )}

        {filteredCourses.map((course, index) => {
          const langConfig = course.language === 'python'
            ? { label: 'Python', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'bg-gradient-to-br from-indigo-500 to-purple-600' }
            : { label: 'C++', bg: 'bg-orange-50', text: 'text-orange-700', icon: 'bg-gradient-to-br from-orange-500 to-red-600' };

          return (
            <div
              key={course.id}
              className="group bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-md hover:border-slate-200 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${langConfig.icon} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Code2 className="w-6 h-6 text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-lg truncate">{course.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${langConfig.bg} ${langConfig.text}`}>
                        {langConfig.label}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        course.isPublished
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {course.isPublished ? 'Опубликован' : 'Черновик'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {course.estimatedHours && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          ~{course.estimatedHours} ч
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <ListOrdered className="w-3.5 h-3.5" />
                        Порядок: {course.orderIndex}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/admin/courses/${course.id}/lessons`}>
                      <Button size="sm" variant="outline" className="rounded-xl gap-1.5 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                        Уроки
                      </Button>
                    </Link>
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button size="sm" variant="outline" className="rounded-xl gap-1.5 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                        Изменить
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(course.id)}
                      className="rounded-xl gap-1.5 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
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
