'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  Code2,
  FlaskConical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Save,
  Loader2,
  ArrowRight,
  Hash,
  Calendar,
} from 'lucide-react';

interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  code: string;
  language: string;
  status: string;
  testResults: {
    passedTests: number;
    totalTests: number;
    details: Array<{
      testId: number;
      passed: boolean;
      actualOutput: string;
      expectedOutput: string;
      error?: string;
    }>;
  };
  score: number;
  maxScore: number;
  teacherFeedback?: string;
  attemptNumber: number;
  createdAt: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  points: number;
}

export default function ReviewSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  const loadSubmission = async () => {
    try {
      const subRes = await apiClient.get<Submission>(`/submissions/${submissionId}`);
      if (subRes.success && subRes.data) {
        setSubmission(subRes.data);
        setScore(String(subRes.data.score));
        setFeedback(subRes.data.teacherFeedback || '');

        // Load assignment info
        const assignRes = await apiClient.get<Assignment>(`/assignments/${subRes.data.assignmentId}`);
        if (assignRes.success && assignRes.data) {
          setAssignment(assignRes.data);
        }
      }
    } catch (error) {
      console.error('Failed to load submission', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async () => {
    if (!submission) return;
    setIsSubmitting(true);

    try {
      const response = await apiClient.post(`/submissions/${submissionId}/review`, {
        score: parseInt(score, 10) || 0,
        teacherFeedback: feedback,
      });
      if (response.success) {
        setReviewed(true);
      }
    } catch (error: any) {
      alert(error.message || 'Ошибка сохранения');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
            <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">Работа не найдена</h3>
        <p className="text-slate-400 text-sm mt-1">Возможно, она была удалена или у вас нет доступа</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 text-sm font-medium transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Назад к списку
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Проверка работы</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-emerald-100 text-sm flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                Попытка {submission.attemptNumber}
              </span>
              <span className="text-emerald-200/50">|</span>
              <span className="text-emerald-100 text-sm flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(submission.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Info */}
      {assignment && (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
            <h3 className="font-semibold text-indigo-800 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {assignment.title}
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 leading-relaxed">{assignment.description}</p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium bg-amber-50 text-amber-700 border-amber-200">
                <Star className="w-3 h-3" />
                Максимум: {assignment.points} баллов
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Student Code */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-400" />
            Код ученика
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono font-medium">
            {submission.language}
          </span>
        </div>
        <div className="p-0">
          <div className="bg-slate-900 overflow-hidden">
            <pre className="text-slate-100 p-5 text-sm overflow-auto max-h-96 whitespace-pre-wrap font-mono leading-relaxed">
              {submission.code}
            </pre>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {submission.testResults && (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-slate-400" />
              Результаты тестов
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                submission.testResults.passedTests === submission.testResults.totalTests
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}>
                {submission.testResults.passedTests}/{submission.testResults.totalTests}
              </span>
              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    submission.testResults.passedTests === submission.testResults.totalTests
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${(submission.testResults.passedTests / submission.testResults.totalTests) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {submission.testResults.details?.map((test) => (
              <div
                key={test.testId}
                className={`rounded-xl p-4 text-sm border transition-all ${
                  test.passed
                    ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-red-50/50 border-red-200 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className={`font-medium ${test.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                    Тест #{test.testId}: {test.passed ? 'Пройден' : 'Не пройден'}
                  </span>
                </div>
                {!test.passed && (
                  <div className="mt-3 ml-6 space-y-2 text-xs">
                    {test.error ? (
                      <div className="bg-red-100/50 rounded-lg p-2.5">
                        <span className="text-red-700 font-medium">Ошибка: </span>
                        <span className="text-red-600">{test.error}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-2.5 border border-slate-200">
                          <span className="text-slate-500 font-medium block mb-1">Ожидалось:</span>
                          <code className="text-slate-700 font-mono">{test.expectedOutput}</code>
                        </div>
                        <div className="bg-white rounded-lg p-2.5 border border-slate-200">
                          <span className="text-slate-500 font-medium block mb-1">Получено:</span>
                          <code className="text-slate-700 font-mono">{test.actualOutput}</code>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className={`px-6 py-4 border-b ${
          reviewed
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100'
        }`}>
          <h3 className={`font-semibold flex items-center gap-2 ${reviewed ? 'text-emerald-800' : 'text-amber-800'}`}>
            {reviewed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Оценка сохранена
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                Оценка и комментарий
              </>
            )}
          </h3>
        </div>
        <div className="p-6">
          {reviewed ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-800">Работа проверена!</p>
                  <p className="text-emerald-700 text-sm mt-1">
                    Балл: <span className="font-medium">{score}/{submission.maxScore}</span>
                  </p>
                  {feedback && (
                    <p className="text-emerald-700 text-sm mt-1">
                      Комментарий: <span className="italic">{feedback}</span>
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/teacher/reviews')}
                className="rounded-xl border-slate-200 hover:bg-slate-50 group"
              >
                Вернуться к списку
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-slate-400" />
                    Балл (0 -- {submission.maxScore})
                  </span>
                </label>
                <Input
                  type="number"
                  min={0}
                  max={submission.maxScore}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder={`Максимум: ${submission.maxScore}`}
                  className="rounded-xl border-slate-200 focus:border-amber-400 focus:ring-amber-400 max-w-xs"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    Комментарий для ученика
                  </span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Напишите обратную связь..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all resize-none min-h-[120px]"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleReview}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить оценку
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="rounded-xl border-slate-200 hover:bg-slate-50"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
