'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Course, LessonWithProgress } from '@code-platform/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  GraduationCap,
  Layers,
  Lock,
  Loader2,
  Play,
  RotateCcw,
  Code2,
  Sparkles,
  Trophy,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

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
      setIsEnrolling(true);
      await apiClient.post(`/courses/${courseId}/enroll`);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Failed to enroll', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const progress = useMemo(() => {
    if (lessons.length === 0) return { completed: 0, inProgress: 0, total: 0, percentage: 0 };
    const completed = lessons.filter((l) => l.status === 'completed').length;
    const inProgress = lessons.filter((l) => l.status === 'in_progress').length;
    const total = lessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, inProgress, total, percentage };
  }, [lessons]);

  const langConfig = {
    python: {
      label: 'Python',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      progressFrom: 'from-indigo-500',
      progressTo: 'to-purple-500',
      gradientBg: 'from-indigo-500/10 via-purple-500/5 to-transparent',
      icon: Code2,
      dot: 'bg-indigo-500',
    },
    cpp: {
      label: 'C++',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-700 border-orange-200',
      progressFrom: 'from-orange-500',
      progressTo: 'to-amber-500',
      gradientBg: 'from-orange-500/10 via-amber-500/5 to-transparent',
      icon: Layers,
      dot: 'bg-orange-500',
    },
  };

  const levelLabels: Record<string, string> = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-32 mb-6" />
        <div className="rounded-2xl border border-slate-100 bg-white p-8 mb-8">
          <div className="h-8 bg-slate-200 rounded w-64 mb-3" />
          <div className="h-5 bg-slate-100 rounded w-96 mb-4" />
          <div className="h-3 bg-slate-200 rounded-full w-full mb-6" />
          <div className="flex gap-4">
            <div className="h-10 bg-slate-200 rounded-xl w-32" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-48 mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Курс не найден</h2>
          <p className="text-sm text-slate-500 mb-6">
            Возможно, курс был удалён или вы перешли по неверной ссылке
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/courses')}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к каталогу
          </Button>
        </div>
      </div>
    );
  }

  const lang = langConfig[course.language as keyof typeof langConfig] || langConfig.python;
  const LangIcon = lang.icon;
  const isComplete = progress.percentage === 100;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.push('/courses')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Назад к курсам
      </button>

      {/* Hero section */}
      <div className="rounded-2xl border border-slate-100 shadow-soft bg-white overflow-hidden mb-8 animate-slide-up">
        {/* Gradient accent */}
        <div className={`h-1.5 bg-gradient-to-r ${lang.progressFrom} ${lang.progressTo}`} />

        <div className={`bg-gradient-to-br ${lang.gradientBg} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Language badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${lang.badge}`}>
                  <LangIcon className="w-3.5 h-3.5" />
                  {lang.label}
                </span>
                {course.level && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                    <Sparkles className="w-3 h-3" />
                    {levelLabels[course.level] || course.level}
                  </span>
                )}
                {course.grade && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                    <GraduationCap className="w-3 h-3" />
                    {course.grade} класс
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {course.title}
              </h1>

              {/* Description */}
              {course.description && (
                <p className="text-slate-600 leading-relaxed mb-4 max-w-2xl">
                  {course.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {progress.total}{' '}
                  {progress.total === 1
                    ? 'урок'
                    : progress.total >= 2 && progress.total <= 4
                      ? 'урока'
                      : 'уроков'}
                </span>
                {course.estimatedHours && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />~{course.estimatedHours} часов
                  </span>
                )}
              </div>
            </div>

            {/* Enroll button (right side on desktop) */}
            {!isEnrolled && (
              <div className="shrink-0">
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="rounded-xl px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20"
                  size="lg"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Запись...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Записаться на курс
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Progress section (only if enrolled) */}
          {isEnrolled && (
            <div className="mt-6 pt-6 border-t border-slate-200/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <Trophy className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Zap className="w-5 h-5 text-indigo-500" />
                  )}
                  <span className="text-sm font-medium text-slate-700">
                    {isComplete ? 'Курс завершён!' : 'Ваш прогресс'}
                  </span>
                </div>
                <span className={`text-lg font-bold ${isComplete ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {progress.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200/60 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isComplete
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : `bg-gradient-to-r ${lang.progressFrom} ${lang.progressTo}`
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>
                  {progress.completed} из {progress.total} уроков завершено
                </span>
                {progress.inProgress > 0 && (
                  <span className="text-amber-600 font-medium">
                    {progress.inProgress} в процессе
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lessons section */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Содержание курса</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
            {lessons.length} уроков
          </span>
        </div>
      </div>

      {/* Lesson list */}
      <div className="space-y-2.5">
        {lessons.map((lesson, index) => {
          const isLessonCompleted = lesson.status === 'completed';
          const isLessonInProgress = lesson.status === 'in_progress';
          const isLessonLocked = !isEnrolled && !isLessonCompleted;

          return (
            <Card
              key={lesson.id}
              className={`rounded-2xl border shadow-soft overflow-hidden transition-all duration-200 animate-slide-up ${
                isLessonCompleted
                  ? 'border-emerald-100 bg-emerald-50/30'
                  : isLessonInProgress
                    ? 'border-indigo-100 bg-indigo-50/20'
                    : 'border-slate-100 gradient-card'
              } ${isEnrolled ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''}`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <CardContent className="p-0">
                <div className="flex items-center gap-0">
                  {/* Number / Status indicator */}
                  <div
                    className={`w-16 sm:w-20 shrink-0 flex flex-col items-center justify-center py-5 ${
                      isLessonCompleted
                        ? 'bg-emerald-100/60'
                        : isLessonInProgress
                          ? 'bg-indigo-100/40'
                          : 'bg-slate-50'
                    }`}
                  >
                    {isLessonCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : isLessonInProgress ? (
                      <div className="relative">
                        <Circle className="w-6 h-6 text-indigo-300" />
                        <Play className="w-3 h-3 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    ) : isLessonLocked ? (
                      <Lock className="w-5 h-5 text-slate-300" />
                    ) : (
                      <span className="text-lg font-bold text-slate-300">{index + 1}</span>
                    )}
                    <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      {isLessonCompleted
                        ? 'Готово'
                        : isLessonInProgress
                          ? 'В деле'
                          : `#${index + 1}`}
                    </span>
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0 py-4 px-4 sm:px-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-medium text-sm sm:text-base ${
                            isLessonCompleted
                              ? 'text-slate-600'
                              : isLessonInProgress
                                ? 'text-slate-900'
                                : isLessonLocked
                                  ? 'text-slate-400'
                                  : 'text-slate-800'
                          }`}
                        >
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p
                            className={`text-xs mt-0.5 line-clamp-1 ${
                              isLessonLocked ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          {lesson.durationMinutes && (
                            <span
                              className={`text-xs flex items-center gap-1 ${
                                isLessonLocked ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {lesson.durationMinutes} мин.
                            </span>
                          )}
                          {lesson.egeTopic && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium">
                              ЕГЭ
                              {lesson.egeTaskNumber ? ` #${lesson.egeTaskNumber}` : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="shrink-0 flex items-center gap-2">
                        {/* Status badge */}
                        {isLessonCompleted && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Завершён
                          </span>
                        )}
                        {isLessonInProgress && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-amber-100 text-amber-700">
                            <Loader2 className="w-3 h-3" />
                            В процессе
                          </span>
                        )}

                        {/* Button */}
                        {isEnrolled && (
                          <Link href={`/lessons/${lesson.id}`}>
                            <Button
                              size="sm"
                              variant={isLessonCompleted ? 'outline' : 'default'}
                              className={`rounded-xl text-xs h-8 px-3 ${
                                isLessonCompleted
                                  ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                  : isLessonInProgress
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : ''
                              }`}
                            >
                              {isLessonCompleted ? (
                                <>
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Повторить
                                </>
                              ) : isLessonInProgress ? (
                                <>
                                  <Play className="w-3 h-3 mr-1" />
                                  Продолжить
                                </>
                              ) : (
                                <>
                                  Начать
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </>
                              )}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {lessons.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">Уроки ещё не добавлены</h3>
          <p className="text-sm text-slate-500">
            Преподаватель скоро добавит материалы к этому курсу
          </p>
        </div>
      )}
    </div>
  );
}
