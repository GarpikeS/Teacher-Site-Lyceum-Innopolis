'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { HomeworkWithDetails } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    if (code.includes('#include') || code.includes('cout') || code.includes('int main')) return 'cpp';
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

  if (isLoading) return <div className="p-8">Загрузка...</div>;
  if (!homework) return <div className="p-8">Задание не найдено</div>;

  const language = detectLanguage();
  const MonacoEditor = editorRef.current;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-4 block">
        &larr; Назад к домашним заданиям
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{homework.title}</h1>
        <p className="text-gray-500 mt-1">
          {homework.className} &middot; {homework.teacherFirstName} {homework.teacherLastName}
        </p>
        {homework.deadline && (
          <p className="text-sm text-gray-500 mt-1">
            Дедлайн: {new Date(homework.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Task description */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{homework.assignmentTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">{homework.assignmentDescription}</p>
              {homework.description && (
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                  {homework.description}
                </div>
              )}
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="capitalize">Сложность: {homework.assignmentDifficulty}</span>
                <span>{homework.assignmentPoints} баллов</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Code Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Решение</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded overflow-hidden">
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
                    }}
                  />
                ) : (
                  <textarea
                    className="w-full h-[350px] p-3 font-mono text-sm bg-gray-900 text-gray-100 resize-none"
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
                      <span className="font-medium">
                        Тест #{test.testId}: {test.passed ? 'Пройден' : 'Не пройден'}
                      </span>
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
        </div>
      </div>
    </div>
  );
}
