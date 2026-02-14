import { NotificationType } from '../enums';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  notificationType: NotificationType;
  isRead: boolean;
  linkUrl?: string;
  createdAt: Date;
}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  notificationType: NotificationType;
  linkUrl?: string;
}

export interface MarkAsReadDto {
  notificationIds: string[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  assignments: boolean;
  achievements: boolean;
  feedback: boolean;
  system: boolean;
}
