'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Plus,
  Eye,
  Trash2,
  GraduationCap,
  FileCode,
  Star,
  Users,
  Clock,
  Inbox,
  AlertTriangle,
} from 'lucide-react';

interface TeacherHomework {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  isPublished: boolean;
  classId: string;
  className: string;
  assignmentTitle: string;
  assignmentDifficulty: string;
  assignmentPoints: number;
  studentsCount: number;
  submissionsCount: number;
  createdAt: string;
}

const difficultyConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  easy: { label: 'Легко', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Star className="w-3 h-3" /> },
  medium: { label: 'Средне', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <><Star className="w-3 h-3" /><Star className="w-3 h-3" /></> },
  hard: { label: 'Сложно', className: 'bg-red-50 text-red-700 border-red-200', icon: <><Star className="w-3 h-3" /><Star className="w-3 h-3" /><Star className="w-3 h-3" /></> },
};

export default function TeacherHomeworkPage() {
  const [homework, setHomework] = useState<TeacherHomework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      const response = await apiClient.get<TeacherHomework[]>('/homework/teacher');
      if (response.success && response.data) {
        setHomework(response.data);
      }
    } catch (error) {
      console.error('Failed to load homework', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить домашнее задание?')) return;
    try {
      await apiClient.delete(`/homework/${id}`);
      setHomework(hw => hw.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete homework', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-slate-50 rounded animate-pulse" />
                  <div className="flex gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-9 w-20 bg-slate-100 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-soft">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Домашние задания</h1>
              <p className="text-emerald-100 text-sm mt-0.5">
                {homework.length > 0 ? `${homework.length} заданий` : 'Управление заданиями'}
              </p>
            </div>
          </div>
          <Link href="/teacher/homework/create">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-md rounded-xl font-medium">
              <Plus className="w-4 h-4 mr-1.5" />
              Создать ДЗ
            </Button>
          </Link>
        </div>
      </div>

      {/* Homework List */}
      {homework.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 animate-slide-up">
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="p-4 bg-emerald-50 rounded-full mb-4">
              <Inbox className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Заданий пока нет</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Создайте первое домашнее задание для ваших учеников
            </p>
            <Link href="/teacher/homework/create">
              <Button className="mt-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                <Plus className="w-4 h-4 mr-1.5" />
                Создать первое ДЗ
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {homework.map((hw, index) => {
            const diff = difficultyConfig[hw.assignmentDifficulty] || difficultyConfig.medium;
            const isOverdue = hw.deadline && new Date(hw.deadline) < new Date();
            const progress = hw.studentsCount > 0 ? Math.round((hw.submissionsCount / hw.studentsCount) * 100) : 0;

            return (
              <div
                key={hw.id}
                className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                        <FileCode className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {hw.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="flex items-center gap-1 text-sm text-slate-500">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {hw.className}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-sm text-slate-500">{hw.assignmentTitle}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${diff.className}`}>
                            {diff.icon}
                            {diff.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
                            <Star className="w-3 h-3" />
                            {hw.assignmentPoints} баллов
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
                            <Users className="w-3 h-3" />
                            Сдано: {hw.submissionsCount}/{hw.studentsCount}
                          </span>
                        </div>

                        {/* Progress bar */}
                        {hw.studentsCount > 0 && (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 font-medium">{progress}%</span>
                          </div>
                        )}

                        {hw.deadline && (
                          <p className={`flex items-center gap-1 text-xs mt-2 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                            {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            Дедлайн: {new Date(hw.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4 shrink-0">
                      <Link href={`/teacher/homework/${hw.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Просмотр
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(hw.id)}
                        className="rounded-xl border-slate-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
