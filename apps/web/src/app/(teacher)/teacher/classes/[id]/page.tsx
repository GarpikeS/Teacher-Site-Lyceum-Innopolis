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
  Search,
  UserCheck,
  Trash2,
  Calendar,
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

interface AvailableUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
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
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadClass();
    loadAvailableUsers();
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

  const loadAvailableUsers = async () => {
    try {
      const response = await apiClient.get<AvailableUser[]>(`/classes/${classId}/available-users`);
      if (response.success && response.data) {
        setAvailableUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load available users', error);
    }
  };

  const filteredUsers = availableUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddSelected = async () => {
    if (selectedUsers.length === 0) return;
    setIsAdding(true);
    setAddError('');

    try {
      for (const studentId of selectedUsers) {
        await apiClient.post(`/classes/${classId}/students`, { studentId });
      }
      setSelectedUsers([]);
      loadClass();
      loadAvailableUsers();
    } catch (error: any) {
      setAddError(error.message || 'Ошибка добавления');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    setRemovingId(studentId);
    try {
      await apiClient.delete(`/classes/${classId}/students/${studentId}`);
      loadClass();
      loadAvailableUsers();
    } catch (error: any) {
      alert(error.message || 'Ошибка удаления');
    } finally {
      setRemovingId(null);
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

      {/* Add Users from List */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-indigo-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Добавить участников
            </h3>
            <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
              {availableUsers.length} доступно
            </span>
          </div>
        </div>
        <div className="p-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени или email..."
              className="pl-10 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
            />
          </div>

          {/* Available Users List */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {availableUsers.length === 0
                  ? 'Все зарегистрированные пользователи уже в классе'
                  : 'Пользователи не найдены'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedUsers.includes(user.id) ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700 truncate">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          user.role === 'teacher'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.role === 'teacher' ? 'Учитель' : 'Ученик'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Add Selected Button */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Выбрано: <span className="font-medium text-indigo-600">{selectedUsers.length}</span>
                </span>
                <Button
                  onClick={handleAddSelected}
                  disabled={isAdding || selectedUsers.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-1.5" />
                      Добавить выбранных
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

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
                    <th className="py-3 px-2 font-medium text-slate-400 text-xs uppercase tracking-wider text-center w-16"></th>
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
                      <td className="py-3.5 px-2 text-center">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          disabled={removingId === student.id}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Удалить из класса"
                        >
                          {removingId === student.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
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
