'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { User } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const roleLabels: Record<string, string> = {
  admin: 'Администратор',
  teacher: 'Учитель',
  student: 'Ученик',
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setIsLoading(false);
    };
    loadUser();
  }, [router]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setIsSaving(true);
    setMessage('');

    try {
      const res = await apiClient.patch<User>('/auth/me', { firstName, lastName });
      if (res.success && res.data) {
        setUser(res.data);
        setIsEditing(false);
        setMessage('Профиль обновлён');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Ошибка при сохранении');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
    setIsEditing(false);
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">Профиль</h2>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${
          message.includes('Ошибка') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Личные данные</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Редактировать
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Имя</label>
              {isEditing ? (
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              ) : (
                <p className="text-sm">{user.firstName}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Фамилия</label>
              {isEditing ? (
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              ) : (
                <p className="text-sm">{user.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm">{user.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Роль</label>
            <p className="text-sm">
              <span className="inline-block px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                {roleLabels[user.role] || user.role}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Дата регистрации</label>
            <p className="text-sm">
              {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              Сменить пароль
            </Button>
          ) : (
            <div className="space-y-4 max-w-sm">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Текущий пароль</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Новый пароль</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Подтвердите новый пароль</label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={isChangingPassword}
                  onClick={async () => {
                    if (newPassword.length < 6) {
                      setMessage('Новый пароль должен содержать минимум 6 символов');
                      return;
                    }
                    if (newPassword !== confirmNewPassword) {
                      setMessage('Пароли не совпадают');
                      return;
                    }
                    setIsChangingPassword(true);
                    setMessage('');
                    try {
                      await apiClient.post('/auth/change-password', { currentPassword, newPassword });
                      setMessage('Пароль успешно изменён');
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                    } catch (error: any) {
                      const msg = error.response?.data?.error?.message || error.message || 'Ошибка смены пароля';
                      setMessage(msg);
                    } finally {
                      setIsChangingPassword(false);
                    }
                    setTimeout(() => setMessage(''), 5000);
                  }}
                >
                  {isChangingPassword ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                >
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
