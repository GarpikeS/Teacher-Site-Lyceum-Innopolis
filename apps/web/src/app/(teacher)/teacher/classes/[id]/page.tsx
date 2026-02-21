'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  GraduationCap,
  UserPlus,
  Mail,
  BookOpen,
  FileText,
  CheckCircle2,
  Users,
  AlertCircle,
  Loader2,
  Inbox,
} from 'lucide-react';

interface StudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrolledCourses: number;
  completedLessons: number;
  totalSubmissions: number;
  passedSubmissions: number;
}

interface ClassDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  students: StudentInfo[];
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    loadClass();
  }, [classId]);

  const loadClass = async () => {
    try {
      const response = await apiClient.get<ClassDetail>(`/classes/${classId}`);
      if (response.success && response.data) {
        setClassData(response.data);
      }
    } catch (error) {
      console.error('Failed to load class', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;
    setIsAdding(true);
    setAddError('');

    try {
      const response = await apiClient.post(`/classes/${classId}/students`, { studentEmail });
      if (response.success) {
        setStudentEmail('');
        loadClass();
      }
    } catch (error: any) {
      setAddError(error.message || 'Ученик не найден');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl animate-pulse" />
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 space-y-4">
          <div className="h-6 w-40 bg-slate-100 rounded-lg animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 flex-1 bg-slate-50 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 space-y-4">
          <div className="h-6 w-32 bg-slate-100 rounded-lg animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">Класс не найден</h3>
        <p className="text-slate-400 text-sm mt-1">Возможно, он был удален или у вас нет доступа</p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4 rounded-xl"
        >
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
        Назад к классам
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{classData.name}</h1>
            {classData.description && (
              <p className="text-emerald-100 text-sm mt-0.5">{classData.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Student */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
          <h3 className="font-semibold text-indigo-800 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Добавить ученика
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddStudent} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email ученика</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@school.ru"
                  required
                  className="pl-10 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isAdding}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Добавить
                </>
              )}
            </Button>
          </form>
          {addError && (
            <div className="flex items-center gap-2 mt-3 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {addError}
            </div>
          )}
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">
              Ученики
            </h3>
            <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {classData.students.length}
            </span>
          </div>
        </div>
        <div className="p-6 pt-0">
          {classData.students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Inbox className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">В классе пока нет учеников</p>
              <p className="text-slate-400 text-sm mt-1">Добавьте учеников по email выше</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider">Ученик</th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider">Email</th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider text-center">
                      <span className="flex items-center justify-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Курсов
                      </span>
                    </th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider text-center">
                      <span className="flex items-center justify-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Уроков
                      </span>
                    </th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider text-center">Работ</th>
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider text-center">
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Принято
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {classData.students.map((student) => (
                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <span className="font-medium text-slate-700">{student.firstName} {student.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-slate-400">{student.email}</td>
                      <td className="py-3.5 px-2 text-center text-slate-600">{student.enrolledCourses}</td>
                      <td className="py-3.5 px-2 text-center text-slate-600">{student.completedLessons}</td>
                      <td className="py-3.5 px-2 text-center text-slate-600">{student.totalSubmissions}</td>
                      <td className="py-3.5 px-2 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          student.passedSubmissions > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {student.passedSubmissions}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
