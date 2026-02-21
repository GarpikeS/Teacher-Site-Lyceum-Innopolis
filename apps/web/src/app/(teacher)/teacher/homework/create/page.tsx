'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ClassItem {
  id: string;
  name: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export default function CreateHomeworkPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [language, setLanguage] = useState<'python' | 'cpp'>('python');
  const [starterCode, setStarterCode] = useState('');
  const [points, setPoints] = useState(15);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '', description: '' },
  ]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await apiClient.get<ClassItem[]>('/classes');
      if (response.success && response.data) {
        setClasses(response.data);
        if (response.data.length > 0) setClassId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load classes', error);
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', description: '' }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/homework', {
        title,
        description,
        classId,
        deadline: deadline || undefined,
        assignmentTitle,
        assignmentDescription,
        difficulty,
        language,
        starterCode,
        points,
        testCases: testCases.filter(tc => tc.expectedOutput.trim()),
      });

      if (response.success) {
        router.push('/teacher/homework');
      } else {
        setError('Ошибка создания ДЗ');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка создания ДЗ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Создать домашнее задание</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Название ДЗ</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Домашнее задание #1" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Описание (необязательно)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Дополнительные указания для учеников..."
                className="w-full border rounded p-2 text-sm min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Класс</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Дедлайн (необязательно)</label>
                <Input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Задание</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Название задания</label>
              <Input value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} placeholder="Вычисление суммы" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Условие задания</label>
              <textarea
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                placeholder="Напишите программу, которая..."
                className="w-full border rounded p-2 text-sm min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Сложность</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="w-full border rounded p-2 text-sm">
                  <option value="easy">Легко (10 б.)</option>
                  <option value="medium">Средне (15 б.)</option>
                  <option value="hard">Сложно (25 б.)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Язык</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="w-full border rounded p-2 text-sm">
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Баллы</label>
                <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min={1} max={100} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Начальный код (необязательно)</label>
              <textarea
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                placeholder="# Ваш код..."
                className="w-full border rounded p-2 text-sm font-mono min-h-[80px] bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Тест-кейсы</CardTitle>
              <Button type="button" onClick={addTestCase} variant="outline" size="sm">
                Добавить тест
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {testCases.map((tc, i) => (
              <div key={i} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Тест #{i + 1}</span>
                  {testCases.length > 1 && (
                    <button type="button" onClick={() => removeTestCase(i)} className="text-red-500 text-sm hover:underline">
                      Удалить
                    </button>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Описание</label>
                  <Input value={tc.description} onChange={(e) => updateTestCase(i, 'description', e.target.value)} placeholder="Базовый тест" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Входные данные (stdin)</label>
                    <textarea
                      value={tc.input}
                      onChange={(e) => updateTestCase(i, 'input', e.target.value)}
                      placeholder="5\n3"
                      className="w-full border rounded p-2 text-sm font-mono min-h-[60px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Ожидаемый вывод</label>
                    <textarea
                      value={tc.expectedOutput}
                      onChange={(e) => updateTestCase(i, 'expectedOutput', e.target.value)}
                      placeholder="8"
                      className="w-full border rounded p-2 text-sm font-mono min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Создание...' : 'Создать домашнее задание'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}
