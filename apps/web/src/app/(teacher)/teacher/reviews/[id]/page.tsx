'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  if (isLoading) return <div className="p-8">Загрузка...</div>;
  if (!submission) return <div className="p-8">Работа не найдена</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm">
        &larr; Назад к списку
      </button>

      <h1 className="text-3xl font-bold">Проверка работы</h1>

      {/* Assignment Info */}
      {assignment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{assignment.description}</p>
            <p className="text-sm text-gray-500 mt-2">Максимум баллов: {assignment.points}</p>
          </CardContent>
        </Card>
      )}

      {/* Student Code */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Код ученика</CardTitle>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{submission.language}</span>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {submission.code}
          </pre>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span>Попытка #{submission.attemptNumber}</span>
            <span>{new Date(submission.createdAt).toLocaleString('ru-RU')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {submission.testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Результаты тестов: {submission.testResults.passedTests}/{submission.testResults.totalTests}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {submission.testResults.details?.map((test) => (
                <div
                  key={test.testId}
                  className={`p-3 rounded text-sm border ${
                    test.passed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Тест #{test.testId}: {test.passed ? 'Пройден' : 'Не пройден'}
                    </span>
                  </div>
                  {!test.passed && (
                    <div className="mt-2 text-xs space-y-1">
                      {test.error ? (
                        <p className="text-red-600">{test.error}</p>
                      ) : (
                        <>
                          <p>Ожидалось: <code className="bg-white px-1 rounded">{test.expectedOutput}</code></p>
                          <p>Получено: <code className="bg-white px-1 rounded">{test.actualOutput}</code></p>
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

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {reviewed ? 'Оценка сохранена' : 'Оценка и комментарий'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewed ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded p-4 text-sm">
                <p className="font-medium text-green-800">Работа проверена!</p>
                <p className="text-green-700 mt-1">Балл: {score}/{submission.maxScore}</p>
                {feedback && <p className="text-green-700 mt-1">Комментарий: {feedback}</p>}
              </div>
              <Button variant="outline" onClick={() => router.push('/teacher/reviews')}>
                Вернуться к списку
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Балл (0 — {submission.maxScore})</label>
                <Input
                  type="number"
                  min={0}
                  max={submission.maxScore}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder={`Максимум: ${submission.maxScore}`}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Комментарий для ученика</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Напишите обратную связь..."
                  className="w-full border rounded p-3 text-sm"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleReview} disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить оценку'}
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
