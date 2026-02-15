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
  const [output, setOutput] = useState('');
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<string>('python');
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) return <div className="p-8">Загрузка...</div>;
  if (!lesson) return <div className="p-8">Урок не найден</div>;

  const MonacoEditor = editorRef.current;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-4 block">
        &larr; Назад
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        {lesson.description && <p className="text-gray-600 mt-1">{lesson.description}</p>}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Lesson Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Материал урока</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {lesson.content || ''}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {assignments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Задания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assignments.map((assignment) => (
                    <button
                      key={assignment.id}
                      onClick={() => selectAssignment(assignment)}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        selectedAssignment?.id === assignment.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{assignment.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {assignment.points} баллов | {assignment.difficulty || 'Средний'}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Code Editor */}
        <div className="space-y-4">
          {selectedAssignment && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{selectedAssignment.title}</CardTitle>
                <p className="text-sm text-gray-600">{selectedAssignment.description}</p>
              </CardHeader>
              <CardContent>
                <div className="border rounded overflow-hidden">
                  {MonacoEditor ? (
                    <MonacoEditor
                      height="300px"
                      language={language === 'cpp' ? 'cpp' : 'python'}
                      theme="vs-dark"
                      value={code}
                      onChange={(val: string | undefined) => setCode(val || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  ) : (
                    <textarea
                      className="w-full h-[300px] p-3 font-mono text-sm bg-gray-900 text-gray-100 resize-none"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Введите код..."
                    />
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button onClick={handleRun} disabled={isRunning} variant="outline" className="flex-1">
                    {isRunning ? 'Выполняется...' : 'Запустить'}
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Проверяется...' : 'Отправить решение'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Output */}
          {output && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Вывод</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-auto max-h-48 whitespace-pre-wrap">
                  {output}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Test Results */}
          {submissionResult && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Результаты тестов: {submissionResult.passedTests}/{submissionResult.totalTests}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {submissionResult.details?.map((test) => (
                    <div
                      key={test.testId}
                      className={`p-2 rounded text-sm ${
                        test.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      } border`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          Тест #{test.testId}: {test.passed ? 'Пройден' : 'Не пройден'}
                        </span>
                      </div>
                      {!test.passed && (
                        <div className="mt-1 text-xs">
                          {test.error ? (
                            <p className="text-red-600">{test.error}</p>
                          ) : (
                            <>
                              <p>Ожидалось: <code>{test.expectedOutput}</code></p>
                              <p>Получено: <code>{test.actualOutput}</code></p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleComplete} variant="outline" className="w-full">
            Отметить урок как пройденный
          </Button>
        </div>
      </div>
    </div>
  );
}
