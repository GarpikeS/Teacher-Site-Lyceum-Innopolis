'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Lesson, Assignment, Course } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ArrowLeft,
  BookOpen,
  Code2,
  FileCode2,
  Play,
  Send,
  Terminal,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Trophy,
  Star,
  Zap,
  Flame,
  ChevronDown,
  ChevronUp,
  CheckSquare,
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

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<string>('python');
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  useEffect(() => {
    // Dynamically load Monaco editor
    if (typeof window !== 'undefined') {
      import('@monaco-editor/react').then((mod) => {
        editorRef.current = mod.default;
      });
    }
  }, []);

  const loadLesson = async () => {
    try {
      const [lessonRes, assignmentsRes] = await Promise.all([
        apiClient.get<Lesson>(`/lessons/${lessonId}`),
        apiClient.get<Assignment[]>(`/assignments/lessons/${lessonId}/assignments`),
      ]);

      if (lessonRes.success && lessonRes.data) {
        setLesson(lessonRes.data);
        // Mark lesson as started
        apiClient.post(`/lessons/${lessonId}/start`).catch(() => {});
        // Determine language from course
        try {
          const courseRes = await apiClient.get<Course>(`/courses/${lessonRes.data.courseId}`);
          if (courseRes.success && courseRes.data) {
            setLanguage(courseRes.data.language === 'cpp' ? 'cpp' : 'python');
          }
        } catch {}
      }

      if (assignmentsRes.success && assignmentsRes.data) {
        setAssignments(assignmentsRes.data);
        if (assignmentsRes.data.length > 0) {
          const first = assignmentsRes.data[0];
          setSelectedAssignment(first);
          setCode(first.starterCode || '');
        }
      }
    } catch (error) {
      console.error('Failed to load lesson', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = async () => {
    if (!lesson || !code.trim()) return;
    setIsRunning(true);
    setOutput('');
    setSubmissionResult(null);

    try {
      const response = await apiClient.post('/code/execute', {
        code,
        language,
        input: input || undefined,
      });

      if (response.success && response.data) {
        const { stdout, stderr, error } = response.data as any;
        if (error) {
          setOutput(`Error: ${stderr || error}`);
        } else {
          setOutput(stdout + (stderr ? `\nStderr: ${stderr}` : ''));
        }
      }
    } catch (error: any) {
      setOutput('Ошибка выполнения кода');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !code.trim()) return;
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await apiClient.post(`/assignments/${selectedAssignment.id}/submit`, {
        code,
        language,
      });

      if (response.success && response.data) {
        // Poll for result
        const submissionId = (response.data as any).id;
        pollSubmission(submissionId);
      }
    } catch (error: any) {
      setOutput('Ошибка отправки решения');
      setIsSubmitting(false);
    }
  };

  const pollSubmission = async (submissionId: string) => {
    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 1000));

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

  const selectAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setCode(assignment.starterCode || '');
    setOutput('');
    setSubmissionResult(null);
  };

  const handleComplete = async () => {
    try {
      await apiClient.post(`/lessons/${lessonId}/complete`);
      router.back();
    } catch (error) {
      console.error('Failed to complete lesson', error);
    }
  };

  const getDifficultyConfig = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'Легко', icon: Zap, bg: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'medium':
        return { label: 'Средне', icon: Flame, bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'hard':
        return { label: 'Сложно', icon: Star, bg: 'bg-red-50', text: 'text-red-700' };
      default:
        return { label: difficulty || 'Средне', icon: Zap, bg: 'bg-slate-50', text: 'text-slate-600' };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-32 mb-4" />
          <div className="h-8 bg-slate-200 rounded w-80 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-64" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
              <div className="h-4 bg-slate-100 rounded w-full mb-2" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-32 mb-4" />
              <div className="h-12 bg-slate-100 rounded-xl mb-2" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-40 mb-4" />
            <div className="h-[350px] bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Урок не найден</h3>
          <p className="text-sm text-slate-500 mb-4">
            Возможно, урок был удалён или у вас нет доступа
          </p>
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  const MonacoEditor = editorRef.current;
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
        Назад к курсу
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-sm text-slate-500 mt-1">{lesson.description}</p>
            )}
          </div>
          {/* Language badge */}
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">
            <Code2 className="w-3.5 h-3.5" />
            {language === 'cpp' ? 'C++' : 'Python'}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column: Lesson Content & Assignments */}
        <div className="space-y-4">
          {/* Lesson content card */}
          <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <CardTitle className="text-lg">Материал урока</CardTitle>
                </div>
                <button
                  onClick={() => setShowContent(!showContent)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
                >
                  {showContent ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </CardHeader>
            {showContent && (
              <CardContent>
                <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-900 prose-pre:text-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {lesson.content || ''}
                  </ReactMarkdown>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Assignments list */}
          {assignments.length > 0 && (
            <Card
              className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up"
              style={{ animationDelay: '0.05s' }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">Задания</CardTitle>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700">
                    {assignments.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assignments.map((assignment, index) => {
                    const isSelected = selectedAssignment?.id === assignment.id;
                    const diffCfg = getDifficultyConfig(assignment.difficulty);
                    const DiffIcon = diffCfg.icon;

                    return (
                      <button
                        key={assignment.id}
                        onClick={() => selectAssignment(assignment)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group/task ${
                          isSelected
                            ? 'border-indigo-300 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-200'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-500 group-hover/task:bg-slate-200'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-slate-900 truncate">
                              {assignment.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md ${diffCfg.bg} ${diffCfg.text}`}>
                                <DiffIcon className="w-2.5 h-2.5" />
                                {diffCfg.label}
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700">
                                <Star className="w-2.5 h-2.5" />
                                {assignment.points} б.
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right column: Code Editor + terminal + test results */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {selectedAssignment && (
            <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-indigo-600" />
                    <CardTitle className="text-lg">{selectedAssignment.title}</CardTitle>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {language === 'cpp' ? 'C++' : 'Python'}
                  </span>
                </div>
                {selectedAssignment.description && (
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {selectedAssignment.description}
                  </p>
                )}
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

                {/* Input (stdin) field */}
                <div className="mt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Terminal className="w-4 h-4 text-slate-500" />
                    Входные данные (stdin)
                  </label>
                  <textarea
                    className="w-full h-24 p-3 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите входные данные для программы (каждое значение с новой строки)..."
                  />
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
          )}

          {/* Output panel — under editor */}
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

          {/* Test results — under terminal */}
          {submissionResult && (
            <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
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
                                <code className="text-xs text-emerald-700 font-mono whitespace-pre-wrap">
                                  {test.expectedOutput}
                                </code>
                              </div>
                              <div className="rounded-lg bg-white/80 p-2 border border-red-100">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                  Получено
                                </p>
                                <code className="text-xs text-red-700 font-mono whitespace-pre-wrap">
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

          {/* Complete lesson button */}
          <Button
            onClick={handleComplete}
            variant="outline"
            className="w-full rounded-xl h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Отметить урок как пройденный
          </Button>
        </div>
      </div>
    </div>
  );
}
