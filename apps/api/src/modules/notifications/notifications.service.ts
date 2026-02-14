import { NotificationsModel } from './notifications.model';
import { logger } from '../../utils/logger';
import {
  Notification,
  CreateNotificationDto,
  NotificationType,
} from '@code-platform/shared-types';

export class NotificationsService {
  /**
   * Get user notifications
   */
  static async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    return await NotificationsModel.findByUserId(userId, limit, offset);
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return await NotificationsModel.getUnreadCount(userId);
  }

  /**
   * Create notification
   */
  static async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = await NotificationsModel.create(dto);
    logger.info('Notification created', {
      notificationId: notification.id,
      userId: dto.userId,
      type: dto.notificationType,
    });
    return notification;
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string, userId: string): Promise<void> {
    const updated = await NotificationsModel.markAsRead(id, userId);
    if (!updated) {
      throw new Error('Notification not found');
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<number> {
    return await NotificationsModel.markAllAsRead(userId);
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: string, userId: string): Promise<void> {
    const deleted = await NotificationsModel.delete(id, userId);
    if (!deleted) {
      throw new Error('Notification not found');
    }
  }

  // ============================================
  // Helper methods for creating typed notifications
  // ============================================

  /**
   * Notify user about submission review
   */
  static async notifySubmissionReviewed(
    userId: string,
    assignmentTitle: string,
    status: string,
    submissionId: string
  ): Promise<void> {
    await this.create({
      userId,
      title: 'Submission Reviewed',
      message: `Your submission for "${assignmentTitle}" has been ${status}.`,
      notificationType: NotificationType.FEEDBACK,
      linkUrl: `/submissions/${submissionId}`,
    });
  }

  /**
   * Notify user about earned achievement
   */
  static async notifyAchievementEarned(
    userId: string,
    achievementTitle: string
  ): Promise<void> {
    await this.create({
      userId,
      title: 'Achievement Unlocked!',
      message: `You earned the "${achievementTitle}" achievement!`,
      notificationType: NotificationType.ACHIEVEMENT,
      linkUrl: '/achievements',
    });
  }

  /**
   * Notify student about being added to a class
   */
  static async notifyAddedToClass(
    userId: string,
    className: string
  ): Promise<void> {
    await this.create({
      userId,
      title: 'Added to Class',
      message: `You have been added to the class "${className}".`,
      notificationType: NotificationType.SYSTEM,
      linkUrl: '/courses',
    });
  }

  /**
   * Notify about new assignment
   */
  static async notifyNewAssignment(
    userId: string,
    assignmentTitle: string,
    lessonId: string
  ): Promise<void> {
    await this.create({
      userId,
      title: 'New Assignment',
      message: `A new assignment "${assignmentTitle}" is available.`,
      notificationType: NotificationType.ASSIGNMENT,
      linkUrl: `/lessons/${lessonId}`,
    });
  }
}
