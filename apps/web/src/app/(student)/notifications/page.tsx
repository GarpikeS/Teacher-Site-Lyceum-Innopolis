'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'assignment' | 'achievement' | 'feedback' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeStyles: Record<string, { bg: string; icon: string }> = {
  achievement: { bg: 'bg-amber-50 border-amber-200', icon: '🏆' },
  assignment: { bg: 'bg-blue-50 border-blue-200', icon: '📝' },
  feedback: { bg: 'bg-green-50 border-green-200', icon: '💬' },
  system: { bg: 'bg-gray-50 border-gray-200', icon: '🔔' },
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

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Уведомления</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">{unreadCount} непрочитанных</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Прочитать все
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const style = typeStyles[notification.type] || typeStyles.system;
          return (
            <Card
              key={notification.id}
              className={`border transition-colors ${
                notification.isRead ? 'opacity-60' : style.bg
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm ${notification.isRead ? '' : 'font-semibold'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {new Date(notification.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:underline mt-2"
                      >
                        Отметить как прочитанное
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              Нет уведомлений
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
