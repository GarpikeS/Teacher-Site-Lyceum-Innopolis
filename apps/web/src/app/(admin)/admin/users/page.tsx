'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { User } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Shield,
  GraduationCap,
  UserCheck,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  Mail,
  Crown,
} from 'lucide-react';

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const roleLabels: Record<string, string> = {
  admin: 'Администратор',
  teacher: 'Учитель',
  student: 'Ученик',
};

const roleColors: Record<string, string> = {
  admin: 'bg-red-50 text-red-700 border-red-200',
  teacher: 'bg-blue-50 text-blue-700 border-blue-200',
  student: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield,
  teacher: Crown,
  student: GraduationCap,
};

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (roleFilter) params.set('role', roleFilter);

      const res = await apiClient.get<UsersResponse>(`/users?${params}`);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiClient.patch(`/users/${userId}/role`, { role: newRole });
      loadUsers();
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      await apiClient.patch(`/users/${userId}/active`, { isActive: !currentActive });
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle active', error);
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Удалить пользователя ${email}? Это действие нельзя отменить.`)) return;
    try {
      await apiClient.delete(`/users/${userId}`);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const adminCount = data?.users.filter((u) => u.role === 'admin').length || 0;
  const teacherCount = data?.users.filter((u) => u.role === 'teacher').length || 0;
  const studentCount = data?.users.filter((u) => u.role === 'student').length || 0;
  const activeCount = data?.users.filter((u) => u.isActive).length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Пользователи</h1>
          </div>
          {data && (
            <p className="text-sm text-slate-500 mt-1 ml-[52px]">
              Всего {data.pagination.total} пользователей на платформе
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all shadow-soft min-w-[160px]"
            >
              <option value="">Все роли</option>
              <option value="admin">Администраторы</option>
              <option value="teacher">Учителя</option>
              <option value="student">Ученики</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Всего</p>
              <p className="text-xl font-bold text-slate-800">{data?.pagination.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Админы</p>
              <p className="text-xl font-bold text-slate-800">{adminCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Crown className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Учителя</p>
              <p className="text-xl font-bold text-slate-800">{teacherCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Ученики</p>
              <p className="text-xl font-bold text-slate-800">{studentCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-slate-200 rounded" />
                  <div className="h-3 w-56 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Пользователь</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Роль</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Статус</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Регистрация</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.users.map((user, index) => {
                  const RoleIcon = roleIcons[user.role] || GraduationCap;
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <span className="text-sm font-medium text-slate-800">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {user.email}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all ${roleColors[user.role] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                        >
                          <option value="student">Ученик</option>
                          <option value="teacher">Учитель</option>
                          <option value="admin">Администратор</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer hover:opacity-80 ${
                            user.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {user.isActive ? (
                            <><UserCheck className="w-3 h-3" /> Активен</>
                          ) : (
                            <><UserX className="w-3 h-3" /> Заблокирован</>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id, user.email)}
                          className="rounded-xl gap-1.5 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-xs opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data?.users.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Нет пользователей</h3>
              <p className="text-sm text-slate-500">
                {roleFilter ? 'Попробуйте изменить фильтр' : 'Пользователи пока не зарегистрированы'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl border-slate-200 hover:bg-slate-50 gap-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(data.pagination.totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    page === pageNum
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {data.pagination.totalPages > 5 && (
              <>
                <span className="text-slate-400 px-1">...</span>
                <button
                  onClick={() => setPage(data.pagination.totalPages)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    page === data.pagination.totalPages
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {data.pagination.totalPages}
                </button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-xl border-slate-200 hover:bg-slate-50 gap-1.5 disabled:opacity-40"
          >
            Далее
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
