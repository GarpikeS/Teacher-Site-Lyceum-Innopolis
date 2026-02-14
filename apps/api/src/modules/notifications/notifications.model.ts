import { db } from '../../config/database';
import {
  Notification,
  CreateNotificationDto,
} from '@code-platform/shared-types';

export class NotificationsModel {
  /**
   * Get user notifications (paginated)
   */
  static async findByUserId(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    const result = await db.query<Notification>(
      `SELECT
        id, user_id as "userId",
        title, message,
        notification_type as "notificationType",
        is_read as "isRead",
        link_url as "linkUrl",
        created_at as "createdAt"
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const result = await db.query<{ count: number }>(
      'SELECT COUNT(*)::integer as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    return result.rows[0].count;
  }

  /**
   * Get notification by ID
   */
  static async findById(id: string): Promise<Notification | null> {
    const result = await db.query<Notification>(
      `SELECT
        id, user_id as "userId",
        title, message,
        notification_type as "notificationType",
        is_read as "isRead",
        link_url as "linkUrl",
        created_at as "createdAt"
      FROM notifications WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Create notification
   */
  static async create(dto: CreateNotificationDto): Promise<Notification> {
    const result = await db.query<Notification>(
      `INSERT INTO notifications (user_id, title, message, notification_type, link_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id, user_id as "userId",
        title, message,
        notification_type as "notificationType",
        is_read as "isRead",
        link_url as "linkUrl",
        created_at as "createdAt"`,
      [dto.userId, dto.title, dto.message, dto.notificationType, dto.linkUrl]
    );

    return result.rows[0];
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string, userId: string): Promise<boolean> {
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return (result.rowCount || 0) > 0;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    return result.rowCount || 0;
  }

  /**
   * Delete notification
   */
  static async delete(id: string, userId: string): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return (result.rowCount || 0) > 0;
  }
}
