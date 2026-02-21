'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { HomeworkWithDetails } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Users,
  CheckCircle2,
  BarChart3,
  Code2,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Inbox,
  Loader2,
} from 'lucide-react';

interface Submission {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  language: string;
  status: string;
  score: number;
  maxScore: number;
  submittedAt: string;
}

export default function TeacherHomeworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.id as string;

  const [homework, setHomework] = useState<HomeworkWithDetails | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [homeworkId]);

  const loadData = async () => {
    try {
      const [hwRes, subRes] = await Promise.all([
        apiClient.get<HomeworkWithDetails>(`/homework/${homeworkId}`),
        apiClient.get<Submission[]>(`/homework/${homeworkId}/submissions`),
      ]);

      if (hwRes.success && hwRes.data) setHomework(hwRes.data);
      if (subRes.success && subRes.data) setSubmissions(subRes.data);
    } catch (error) {
      console.error('Failed to load homework data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
      case 'running': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'passed': return 'Сдано';
      case 'failed': return 'Ошибка';
      case 'pending': return 'Ожидает';
      case 'running': return 'Проверяется';
      case 'error': return 'Ошибка';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'failed': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'pending':
      case 'running': return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const difficultyLabel: Record<string, string> = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно',
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!homework) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">Задание не найдено</h3>
        <Button onClick={() => router.back()} variant="outline" className="mt-4 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Назад
        </Button>
      </div>
    );
  }

  const passedCount = submissions.filter(s => s.status === 'passed').length;
  const avgScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 text-sm font-medium transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Назад к списку ДЗ
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{homework.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-emerald-100 text-sm">Класс: {homework.className}</span>
              {homework.deadline && (
                <>
                  <span className="text-emerald-200/50">|</span>
                  <span className="text-emerald-100 text-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Дедлайн: {new Date(homework.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 hover:shadow-md transition-all duration-300 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{submissions.length}</p>
              <p className="text-sm text-slate-500 mt-0.5">Сдано работ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{passedCount}</p>
              <p className="text-sm text-slate-500 mt-0.5">Прошли тесты</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{avgScore}</p>
              <p className="text-sm text-slate-500 mt-0.5">Средний балл</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '250ms' }}>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
          <h3 className="font-semibold text-indigo-800 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            Задание
          </h3>
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-slate-800 text-lg">{homework.assignmentTitle}</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{homework.assignmentDescription}</p>
          <div className="flex gap-3 mt-4">
            <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-slate-50 text-slate-600 border-slate-200 capitalize">
              {difficultyLabel[homework.assignmentDifficulty] || homework.assignmentDifficulty}
            </span>
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium bg-amber-50 text-amber-700 border-amber-200">
              <Star className="w-3 h-3" />
              {homework.assignmentPoints} баллов
            </span>
          </div>
        </div>
      </div>

      {/* Submissions */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-800">Работы учеников</h2>
          <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {submissions.length}
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Inbox className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Пока никто не сдал работу</p>
              <p className="text-slate-400 text-sm mt-1">Ожидайте работы от учеников</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub, index) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                        {sub.firstName[0]}{sub.lastName[0]}
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">{sub.firstName} {sub.lastName}</span>
                        <span className="text-sm text-slate-400 ml-2">{sub.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600">
                        {sub.score || 0}
                        <span className="text-slate-400">/{sub.maxScore || homework.assignmentPoints}</span>
                        <span className="text-slate-400 text-xs ml-1">баллов</span>
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        {getStatusLabel(sub.status)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Code toggle */}
                  <button
                    onClick={() => setExpandedCode(expandedCode === sub.id ? null : sub.id)}
                    className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer mt-3 font-medium transition-colors"
                  >
                    {expandedCode === sub.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Скрыть код
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Показать код
                      </>
                    )}
                  </button>

                  {expandedCode === sub.id && (
                    <div className="mt-3 animate-slide-up">
                      <div className="bg-slate-900 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                          <span className="text-xs text-slate-400 font-mono">{sub.language}</span>
                        </div>
                        <pre className="text-slate-100 p-4 text-sm overflow-auto max-h-64 font-mono leading-relaxed">
                          {sub.code}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
