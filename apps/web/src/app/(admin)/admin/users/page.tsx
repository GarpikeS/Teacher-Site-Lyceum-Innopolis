'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { User } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  admin: 'bg-red-100 text-red-800',
  teacher: 'bg-blue-100 text-blue-800',
  student: 'bg-green-100 text-green-800',
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Пользователи</h2>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Все роли</option>
            <option value="admin">Администраторы</option>
            <option value="teacher">Учителя</option>
            <option value="student">Ученики</option>
          </select>
        </div>
      </div>

      {data && (
        <p className="text-sm text-gray-500 mb-4">
          Всего: {data.pagination.total} пользователей
        </p>
      )}

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium">Имя</th>
                  <th className="text-left p-3 text-sm font-medium">Email</th>
                  <th className="text-left p-3 text-sm font-medium">Роль</th>
                  <th className="text-left p-3 text-sm font-medium">Статус</th>
                  <th className="text-left p-3 text-sm font-medium">Регистрация</th>
                  <th className="text-right p-3 text-sm font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                    <td className="p-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded border-0 ${roleColors[user.role] || 'bg-gray-100'}`}
                      >
                        <option value="student">Ученик</option>
                        <option value="teacher">Учитель</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded cursor-pointer ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                      >
                        {user.isActive ? 'Активен' : 'Заблокирован'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id, user.email)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Назад
          </Button>
          <span className="flex items-center text-sm text-gray-600">
            {page} / {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Далее
          </Button>
        </div>
      )}
    </div>
  );
}
