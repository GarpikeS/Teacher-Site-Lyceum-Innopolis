'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { User } from '@code-platform/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  UserCircle,
  Pencil,
  Save,
  X,
  Mail,
  Shield,
  CalendarDays,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const roleLabels: Record<string, string> = {
  admin: 'Администратор',
  teacher: 'Учитель',
  student: 'Ученик',
};

const roleConfig: Record<string, { bg: string; text: string; border: string }> = {
  admin: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  teacher: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  student: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-48 mb-3" />
          <div className="h-5 bg-slate-100 rounded-lg w-72" />
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-200" />
            <div>
              <div className="h-6 bg-slate-200 rounded w-48 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
  const roleCfg = roleConfig[user.role] || roleConfig.student;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Профиль</h1>
            <p className="text-sm text-slate-500">Управление личными данными</p>
          </div>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div
          className={`mb-6 flex items-center gap-3 p-4 rounded-xl border animate-slide-up ${
            message.includes('Ошибка') || message.includes('пароль') && !message.includes('изменён')
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {message.includes('Ошибка') || (message.includes('пароль') && !message.includes('изменён')) ? (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {/* Profile card */}
      <Card className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-slide-up">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar with initials */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">{initials}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border ${roleCfg.bg} ${roleCfg.text} ${roleCfg.border}`}
                  >
                    <Shield className="w-3 h-3" />
                    {roleLabels[user.role] || user.role}
                  </span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {/* Editable fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <UserCircle className="w-3.5 h-3.5" />
                Имя
              </label>
              {isEditing ? (
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                />
              ) : (
                <p className="text-sm text-slate-900 font-medium py-2.5 px-3 rounded-xl bg-slate-50">
                  {user.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <UserCircle className="w-3.5 h-3.5" />
                Фамилия
              </label>
              {isEditing ? (
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                />
              ) : (
                <p className="text-sm text-slate-900 font-medium py-2.5 px-3 rounded-xl bg-slate-50">
                  {user.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Read-only fields */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <Mail className="w-3.5 h-3.5" />
              Email
            </label>
            <p className="text-sm text-slate-900 font-medium py-2.5 px-3 rounded-xl bg-slate-50">
              {user.email}
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <CalendarDays className="w-3.5 h-3.5" />
              Дата регистрации
            </label>
            <p className="text-sm text-slate-900 font-medium py-2.5 px-3 rounded-xl bg-slate-50">
              {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Edit buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl border-slate-200 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security card */}
      <Card
        className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden mt-6 animate-slide-up"
        style={{ animationDelay: '0.1s' }}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-lg">Безопасность</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
              className="rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Lock className="w-4 h-4 mr-2" />
              Сменить пароль
            </Button>
          ) : (
            <div className="space-y-4 max-w-sm animate-fade-in">
              {/* Current password */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <Lock className="w-3.5 h-3.5" />
                  Текущий пароль
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="rounded-xl border-slate-200 pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <KeyRound className="w-3.5 h-3.5" />
                  Новый пароль
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl border-slate-200 pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {newPassword && newPassword.length < 6 && (
                  <p className="text-xs text-amber-600">Минимум 6 символов</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <KeyRound className="w-3.5 h-3.5" />
                  Подтвердите новый пароль
                </label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                />
                {confirmNewPassword && newPassword !== confirmNewPassword && (
                  <p className="text-xs text-red-600">Пароли не совпадают</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
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
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                  className="rounded-xl border-slate-200 hover:bg-slate-50"
                >
                  <X className="w-4 h-4 mr-2" />
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
