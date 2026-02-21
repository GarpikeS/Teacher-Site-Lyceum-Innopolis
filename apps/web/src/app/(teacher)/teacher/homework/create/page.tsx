'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Code2,
  FlaskConical,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  GraduationCap,
  Calendar,
  Star,
  Terminal,
} from 'lucide-react';

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
            <h1 className="text-2xl font-bold text-white">Создать домашнее задание</h1>
            <p className="text-emerald-100 text-sm mt-0.5">Заполните информацию о задании и тест-кейсы</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Main info */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
            <h3 className="font-semibold text-indigo-800 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Основная информация
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Название ДЗ</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Домашнее задание #1"
                required
                className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Описание (необязательно)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Дополнительные указания для учеников..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm min-h-[80px] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    Класс
                  </span>
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all bg-white"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Дедлайн (необязательно)
                  </span>
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
            <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Задание
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Название задания</label>
              <Input
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="Вычисление суммы"
                required
                className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Условие задания</label>
              <textarea
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                placeholder="Напишите программу, которая..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm min-h-[100px] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-slate-400" />
                    Сложность
                  </span>
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all bg-white"
                >
                  <option value="easy">Легко (10 б.)</option>
                  <option value="medium">Средне (15 б.)</option>
                  <option value="hard">Сложно (25 б.)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    Язык
                  </span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all bg-white"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Баллы</label>
                <Input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Начальный код (необязательно)</label>
              <textarea
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                placeholder="# Ваш код..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm font-mono min-h-[80px] bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Тест-кейсы
              </h3>
              <Button
                type="button"
                onClick={addTestCase}
                variant="outline"
                size="sm"
                className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Добавить тест
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {testCases.map((tc, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-xl p-4 space-y-3 hover:border-slate-300 transition-colors bg-slate-50/50"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    Тест #{i + 1}
                  </span>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(i)}
                      className="flex items-center gap-1 text-red-400 text-sm hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Удалить
                    </button>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Описание</label>
                  <Input
                    value={tc.description}
                    onChange={(e) => updateTestCase(i, 'description', e.target.value)}
                    placeholder="Базовый тест"
                    className="rounded-xl border-slate-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Входные данные (stdin)</label>
                    <textarea
                      value={tc.input}
                      onChange={(e) => updateTestCase(i, 'input', e.target.value)}
                      placeholder="5\n3"
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-mono min-h-[60px] bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Ожидаемый вывод</label>
                    <textarea
                      value={tc.expectedOutput}
                      onChange={(e) => updateTestCase(i, 'expectedOutput', e.target.value)}
                      placeholder="8"
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-mono min-h-[60px] bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 font-medium text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Создать домашнее задание
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl h-12 px-6 border-slate-200 hover:bg-slate-50"
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}
