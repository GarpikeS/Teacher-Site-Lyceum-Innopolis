'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { HomeworkWithDetails } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CalendarClock,
  User,
  Star,
  Flame,
  Zap,
  Play,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Terminal,
  FileCode2,
  AlertTriangle,
  Clock,
  Trophy,
  Info,
  ChevronDown,
  ChevronUp,
  Code2,
} from 'lucide-react';

interface SubmissionResult {
  passedTests: number;
  totalTests: number;
  details: Array<{
    testId: number;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    error?: string;
  }>;
}

export default function HomeworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.id as string;

  const [homework, setHomework] = useState<HomeworkWithDetails | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    loadHomework();
  }, [homeworkId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@monaco-editor/react').then((mod) => {
        editorRef.current = mod.default;
      });
    }
  }, []);

  const loadHomework = async () => {
    try {
      const response = await apiClient.get<HomeworkWithDetails>(`/homework/${homeworkId}`);
      if (response.success && response.data) {
        setHomework(response.data);
        setCode(response.data.assignmentStarterCode || '');
      }
    } catch (error) {
      console.error('Failed to load homework', error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectLanguage = () => {
    if (!homework) return 'python';
    const code = homework.assignmentStarterCode || '';
    if (code.includes('#include') || code.includes('cout') || code.includes('int main'))
      return 'cpp';
    return 'python';
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput('');
    setSubmissionResult(null);

    try {
      const response = await apiClient.post('/code/execute', {
        code,
        language: detectLanguage(),
      });

      if (response.success && response.data) {
        const { stdout, stderr, error } = response.data as any;
        if (error) {
          setOutput(`Error: ${stderr || error}`);
        } else {
          setOutput(stdout + (stderr ? `\nStderr: ${stderr}` : ''));
        }
      }
    } catch {
      setOutput('Ошибка выполнения кода');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!homework || !code.trim()) return;
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await apiClient.post(`/assignments/${homework.assignmentId}/submit`, {
        code,
        language: detectLanguage(),
      });

      if (response.success && response.data) {
        const submissionId = (response.data as any).id;
        pollSubmission(submissionId);
      }
    } catch {
      setOutput('Ошибка отправки решения');
      setIsSubmitting(false);
    }
  };

  const pollSubmission = async (submissionId: string) => {
    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await apiClient.get(`/submissions/${submissionId}`);
        if (res.success && res.data) {
          const sub = res.data as any;
          if (sub.status === 'passed' || sub.status === 'failed' || sub.status === 'error') {
            setSubmissionResult(sub.testResults);
            setIsSubmitting(false);
            return;
          }
        }
      } catch {
        // Keep polling
      }
    }
    setIsSubmitting(false);
    setOutput('Время ожидания результата истекло');
  };

  const getDifficultyConfig = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          label: 'Легко',
          icon: Zap,
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
        };
      case 'medium':
        return {
          label: 'Средне',
          icon: Flame,
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
        };
      case 'hard':
        return {
          label: 'Сложно',
          icon: Star,
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
        };
      default:
        return {
          label: difficulty || '',
          icon: Zap,
          bg: 'bg-slate-50',
          text: 'text-slate-600',
          border: 'border-slate-200',
        };
    }
  };

  const getDeadlineInfo = (deadline?: Date) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0)
      return { text: 'Просрочено', className: 'text-red-600 bg-red-50', icon: AlertTriangle };
    if (days === 0)
      return { text: 'Сегодня', className: 'text-red-600 bg-red-50', icon: Flame };
    if (days === 1)
      return { text: 'Завтра', className: 'text-amber-600 bg-amber-50', icon: Clock };
    if (days <= 3)
      return {
        text: `Осталось ${days} дн.`,
        className: 'text-amber-500 bg-amber-50',
        icon: Clock,
      };
    return {
      text: `Осталось ${days} дн.`,
      className: 'text-slate-500 bg-slate-50',
      icon: Clock,
    };
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-48 mb-4" />
          <div className="h-7 bg-slate-200 rounded w-80 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-64" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
            <div className="h-4 bg-slate-100 rounded w-full mb-2" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-32 mb-4" />
            <div className="h-[350px] bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!homework) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Задание не найдено</h3>
          <p className="text-sm text-slate-500 mb-4">
            Возможно, задание было удалено или у вас нет доступа
          </p>
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  const language = detectLanguage();
  const MonacoEditor = editorRef.current;
  const diffConfig = getDifficultyConfig(homework.assignmentDifficulty);
  const DiffIcon = diffConfig.icon;
  const deadlineInfo = getDeadlineInfo(homework.deadline);
  const scorePercentage = submissionResult
    ? Math.round((submissionResult.passedTests / submissionResult.totalTests) * 100)
    : 0;
  const allPassed =
    submissionResult &&
    submissionResult.passedTests === submissionResult.totalTests;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Назад к домашним заданиям
      </button>

      {/* Header section */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <FileCode2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{homework.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {homework.teacherFirstName} {homework.teacherLastName}
              </span>
              <span className="text-slate-300">|</span>
              <span>{homework.className}</span>
              {homework.deadline && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="w-3.5 h-3.5" />
                    {new Date(homework.deadline).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
          {/* Deadline countdown badge */}
          {deadlineInfo && (
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl ${deadlineInfo.className}`}
            >
              <deadlineInfo.icon className="w-3.5 h-3.5" />
              {deadlineInfo.text}
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column: Task info */}
        <div className="space-y-4">
          {/* Assignment info card */}
          <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Code2 className="w-5 h-5 text-indigo-600 shrink-0" />
                  <CardTitle className="text-lg truncate">{homework.assignmentTitle}</CardTitle>
                </div>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
                >
                  {showDescription ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${diffConfig.bg} ${diffConfig.text}`}
                >
                  <DiffIcon className="w-3 h-3" />
                  {diffConfig.label}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700">
                  <Star className="w-3 h-3" />
                  {homework.assignmentPoints} баллов
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  {language === 'cpp' ? 'C++' : 'Python'}
                </span>
              </div>
            </CardHeader>
            {showDescription && (
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {homework.assignmentDescription}
                </p>
                {homework.description && (
                  <div className="flex gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-800">{homework.description}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Output panel */}
          {output && (
            <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-500" />
                  <CardTitle className="text-sm font-semibold text-slate-700">Вывод</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm overflow-auto max-h-48 whitespace-pre-wrap font-mono leading-relaxed">
                  {output}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Submission results */}
          {submissionResult && (
            <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
              {/* Score bar */}
              <div
                className={`h-1 ${
                  allPassed
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                    : 'bg-gradient-to-r from-red-500 to-orange-400'
                }`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy
                      className={`w-5 h-5 ${allPassed ? 'text-emerald-600' : 'text-slate-400'}`}
                    />
                    <CardTitle className="text-sm font-semibold text-slate-700">
                      Результаты тестирования
                    </CardTitle>
                  </div>
                  {/* Score badge */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                      allPassed
                        ? 'bg-emerald-50 text-emerald-700'
                        : scorePercentage > 50
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <span className="text-lg font-bold">
                      {submissionResult.passedTests}/{submissionResult.totalTests}
                    </span>
                    <span className="text-xs font-medium">тестов</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        allPassed
                          ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                          : scorePercentage > 50
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-red-500 to-orange-400'
                      }`}
                      style={{ width: `${scorePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-400">0%</span>
                    <span
                      className={`text-xs font-semibold ${
                        allPassed
                          ? 'text-emerald-600'
                          : scorePercentage > 50
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {scorePercentage}%
                    </span>
                  </div>
                </div>

                {/* All passed banner */}
                {allPassed && (
                  <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">
                      Все тесты пройдены! Отличная работа!
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {submissionResult.details?.map((test, idx) => (
                    <div
                      key={test.testId}
                      className={`rounded-xl border p-3 transition-all animate-slide-up ${
                        test.passed
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-red-50/50 border-red-200'
                      }`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-center gap-2">
                        {test.passed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            test.passed ? 'text-emerald-800' : 'text-red-800'
                          }`}
                        >
                          Тест #{test.testId}
                        </span>
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-md font-medium ${
                            test.passed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {test.passed ? 'Пройден' : 'Не пройден'}
                        </span>
                      </div>
                      {!test.passed && (
                        <div className="mt-2 pl-6 space-y-1">
                          {test.error ? (
                            <div className="flex items-start gap-1.5">
                              <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-red-700 font-mono">{test.error}</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-lg bg-white/80 p-2 border border-emerald-100">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                  Ожидалось
                                </p>
                                <code className="text-xs text-emerald-700 font-mono">
                                  {test.expectedOutput}
                                </code>
                              </div>
                              <div className="rounded-lg bg-white/80 p-2 border border-red-100">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                  Получено
                                </p>
                                <code className="text-xs text-red-700 font-mono">
                                  {test.actualOutput}
                                </code>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Code editor */}
        <div
          className="space-y-4 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-indigo-600" />
                  <CardTitle className="text-lg">Решение</CardTitle>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  {language === 'cpp' ? 'C++' : 'Python'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Editor */}
              <div className="rounded-xl overflow-hidden border border-slate-200">
                {MonacoEditor ? (
                  <MonacoEditor
                    height="350px"
                    language={language === 'cpp' ? 'cpp' : 'python'}
                    theme="vs-dark"
                    value={code}
                    onChange={(val: string | undefined) => setCode(val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 12, bottom: 12 },
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  <textarea
                    className="w-full h-[350px] p-4 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Введите код..."
                  />
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleRun}
                  disabled={isRunning || !code.trim()}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Выполняется...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Запустить
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !code.trim()}
                  className="flex-1 rounded-xl h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Проверяется...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить решение
                    </>
                  )}
                </Button>
              </div>

              {/* Submitting indicator */}
              {isSubmitting && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 animate-fade-in">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-800">
                      Проверяем ваше решение...
                    </p>
                    <p className="text-xs text-indigo-500">
                      Это может занять до 30 секунд
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
