'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Plus,
  X,
  Users,
  Calendar,
  ArrowRight,
  FolderOpen,
  Loader2,
} from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  createdAt: string;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await apiClient.get<ClassItem[]>('/classes');
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Failed to load classes', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setIsCreating(true);
    try {
      await apiClient.post('/classes', { name: formName, description: formDescription });
      setFormName('');
      setFormDescription('');
      setShowForm(false);
      loadClasses();
    } catch (error: any) {
      alert(error.message || 'Ошибка создания класса');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="h-6 w-40 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-4 w-64 bg-slate-50 rounded animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-4 w-28 bg-slate-50 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-slate-50 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse" />
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
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Мои классы</h1>
              <p className="text-emerald-100 text-sm mt-0.5">
                {classes.length > 0 ? `${classes.length} класс(ов)` : 'Управление классами'}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className={`rounded-xl font-medium transition-all ${
              showForm
                ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-md'
            }`}
            variant={showForm ? 'outline' : 'default'}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-1.5" />
                Отмена
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1.5" />
                Создать класс
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
            <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Новый класс
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Название</label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Например: 7А класс"
                  required
                  className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Описание</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Краткое описание класса"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all resize-none"
                  rows={2}
                />
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Создать'
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Classes List */}
      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 animate-slide-up">
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="p-4 bg-emerald-50 rounded-full mb-4">
              <FolderOpen className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Классов пока нет</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Создайте первый класс, чтобы начать добавлять учеников и назначать задания
            </p>
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="mt-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Создать первый класс
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {classes.map((cls, index) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 hover:shadow-md hover:border-slate-200 transition-all duration-300 group animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {cls.name}
                    </h3>
                    {cls.description && (
                      <p className="text-sm text-slate-500 mt-1">{cls.description}</p>
                    )}
                    <div className="flex gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {cls.studentCount} учеников
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(cls.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/teacher/classes/${cls.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all group/btn"
                  >
                    Подробнее
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
