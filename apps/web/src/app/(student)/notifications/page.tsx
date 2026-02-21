'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Trophy,
  FileText,
  MessageSquare,
  Info,
  CheckCheck,
  Check,
  BellOff,
  Sparkles,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'assignment' | 'achievement' | 'feedback' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<
  string,
  {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    icon: typeof Bell;
    accent: string;
  }
> = {
  achievement: {
    bg: 'bg-amber-50/50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    icon: Trophy,
    accent: 'from-amber-500 to-orange-500',
  },
  assignment: {
    bg: 'bg-indigo-50/50',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: FileText,
    accent: 'from-indigo-500 to-purple-500',
  },
  feedback: {
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: MessageSquare,
    accent: 'from-emerald-500 to-green-500',
  },
  system: {
    bg: 'bg-slate-50/50',
    border: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    icon: Info,
    accent: 'from-slate-500 to-slate-600',
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await apiClient.get<Notification[]>('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-64 mb-3" />
          <div className="h-5 bg-slate-100 rounded-lg w-80" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Уведомления</h1>
            <p className="text-sm text-slate-500">
              {unreadCount > 0
                ? `${unreadCount} непрочитанных`
                : 'Все прочитано'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Прочитать все
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const config = typeConfig[notification.type] || typeConfig.system;
          const TypeIcon = config.icon;

          return (
            <Card
              key={notification.id}
              className={`group rounded-2xl shadow-soft overflow-hidden transition-all duration-300 animate-slide-up ${
                notification.isRead
                  ? 'border border-slate-100 bg-white opacity-70 hover:opacity-100'
                  : `border ${config.border} ${config.bg} hover:shadow-lg`
              }`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Accent line for unread */}
              {!notification.isRead && (
                <div className={`h-0.5 bg-gradient-to-r ${config.accent}`} />
              )}

              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Type icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notification.isRead ? 'bg-slate-100' : config.iconBg
                    }`}
                  >
                    <TypeIcon
                      className={`w-5 h-5 ${
                        notification.isRead ? 'text-slate-400' : config.iconColor
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3
                          className={`text-sm leading-snug ${
                            notification.isRead
                              ? 'text-slate-600'
                              : 'font-semibold text-slate-900'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap pt-0.5">
                        {new Date(notification.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Mark as read button */}
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-all"
                      >
                        <Check className="w-3 h-3" />
                        Отметить как прочитанное
                      </button>
                    )}
                  </div>

                  {/* Unread dot indicator */}
                  {!notification.isRead && (
                    <div className="shrink-0 mt-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${config.accent}`} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              Нет уведомлений
            </h3>
            <p className="text-sm text-slate-500">
              Здесь будут появляться новости о ваших курсах и заданиях
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
