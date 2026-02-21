'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { CourseWithProgress } from '@code-platform/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  Clock,
  CheckCircle,
  ArrowRight,
  Code2,
  Layers,
  Sparkles,
} from 'lucide-react';

type LanguageFilter = 'all' | 'python' | 'cpp';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all');

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

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage =
        languageFilter === 'all' || course.language === languageFilter;
      return matchesSearch && matchesLanguage;
    });
  }, [courses, searchQuery, languageFilter]);

  const stats = useMemo(() => {
    const enrolled = courses.filter((c) => c.enrolledAt).length;
    const completed = courses.filter(
      (c) => Number(c.progressPercentage) === 100
    ).length;
    return { total: courses.length, enrolled, completed };
  }, [courses]);

  const langConfig = {
    python: {
      label: 'Python',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-700',
      progressFrom: 'from-indigo-500',
      progressTo: 'to-purple-500',
      icon: Code2,
      dot: 'bg-indigo-500',
    },
    cpp: {
      label: 'C++',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-700',
      progressFrom: 'from-orange-500',
      progressTo: 'to-amber-500',
      icon: Layers,
      dot: 'bg-orange-500',
    },
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Skeleton header */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-64 mb-3" />
          <div className="h-5 bg-slate-100 rounded-lg w-96" />
        </div>
        {/* Skeleton cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="h-5 bg-slate-200 rounded w-32" />
              </div>
              <div className="h-4 bg-slate-100 rounded w-full mb-2" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-4" />
              <div className="h-2 bg-slate-200 rounded-full w-full mb-4" />
              <div className="h-10 bg-slate-200 rounded-lg w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Каталог курсов
            </h1>
            <p className="text-sm text-slate-500">
              Выберите курс и начните обучение программированию
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Всего курсов</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.enrolled}
              </p>
              <p className="text-xs text-slate-500">Записан</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl border border-slate-100 bg-white shadow-soft p-4 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.completed}
              </p>
              <p className="text-xs text-slate-500">Завершено</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setLanguageFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                languageFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setLanguageFilter('python')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                languageFilter === 'python'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setLanguageFilter('cpp')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                languageFilter === 'cpp'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-orange-600'
              }`}
            >
              C++
            </button>
          </div>
        </div>
      </div>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            Курсы не найдены
          </h3>
          <p className="text-sm text-slate-500">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course, index) => {
            const lang =
              langConfig[course.language as keyof typeof langConfig] ||
              langConfig.python;
            const LangIcon = lang.icon;
            const progress = Math.round(Number(course.progressPercentage) || 0);
            const completed = Number(course.completedLessons) || 0;
            const total = Number(course.totalLessons) || 0;
            const isComplete = progress === 100;

            return (
              <Card
                key={course.id}
                className="group rounded-2xl border border-slate-100 shadow-soft gradient-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Color accent top stripe */}
                <div
                  className={`h-1 bg-gradient-to-r ${lang.progressFrom} ${lang.progressTo}`}
                />

                <CardContent className="p-5">
                  {/* Language badge + Title */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${lang.bg} flex items-center justify-center shrink-0`}
                      >
                        <LangIcon className={`w-5 h-5 ${lang.text}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {course.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${lang.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${lang.dot}`}
                          />
                          {lang.label}
                        </span>
                      </div>
                    </div>
                    {isComplete && (
                      <div className="shrink-0">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {course.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {course.description}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {total}{' '}
                      {total === 1
                        ? 'урок'
                        : total >= 2 && total <= 4
                          ? 'урока'
                          : 'уроков'}
                    </span>
                    {course.estimatedHours && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />~
                        {course.estimatedHours} ч.
                      </span>
                    )}
                    {course.level && (
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {course.level === 'beginner'
                          ? 'Начальный'
                          : course.level === 'intermediate'
                            ? 'Средний'
                            : 'Продвинутый'}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-500">
                        {completed} из {total} уроков
                      </span>
                      <span
                        className={`font-semibold ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}
                      >
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                            : `bg-gradient-to-r ${lang.progressFrom} ${lang.progressTo}`
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action button */}
                  <Link href={`/courses/${course.id}`} className="block">
                    <Button
                      className={`w-full rounded-xl group/btn transition-all duration-200 ${
                        isComplete
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : course.enrolledAt
                            ? ''
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                      variant={
                        isComplete
                          ? 'outline'
                          : course.enrolledAt
                            ? 'default'
                            : 'default'
                      }
                    >
                      <span>
                        {isComplete
                          ? 'Повторить'
                          : course.enrolledAt
                            ? 'Продолжить'
                            : 'Начать курс'}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
