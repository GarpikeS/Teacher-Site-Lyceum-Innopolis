import { Request, Response } from 'express';
import { NotificationsService } from './notifications.service';
import { logger } from '../../utils/logger';

export class NotificationsController {
  /**
   * GET /api/v1/notifications
   * Get user's notifications (paginated)
   */
  static async getNotifications(req: Request, res: Response) {
    try {
      const user = req.user!;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const notifications = await NotificationsService.getUserNotifications(
        user.id,
        Math.min(limit, 50),
        offset
      );

      res.json({
        success: true,
        data: notifications,
      });
    } catch (error: any) {
      logger.error('Get notifications error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get notifications',
        },
      });
    }
  }

  /**
   * GET /api/v1/notifications/unread-count
   * Get unread notifications count
   */
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const user = req.user!;
      const count = await NotificationsService.getUnreadCount(user.id);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      logger.error('Get unread count error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get unread count',
        },
      });
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   * Mark notification as read
   */
  static async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      await NotificationsService.markAsRead(id, user.id);

      res.json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error: any) {
      logger.error('Mark as read error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'UPDATE_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * PATCH /api/v1/notifications/read-all
   * Mark all notifications as read
   */
  static async markAllAsRead(req: Request, res: Response) {
    try {
      const user = req.user!;
      const count = await NotificationsService.markAllAsRead(user.id);

      res.json({
        success: true,
        data: { markedCount: count },
      });
    } catch (error: any) {
      logger.error('Mark all as read error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to mark all as read',
        },
      });
    }
  }

  /**
   * DELETE /api/v1/notifications/:id
   * Delete notification
   */
  static async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      await NotificationsService.deleteNotification(id, user.id);

      res.json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete notification error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'DELETE_ERROR',
          message: error.message || 'Failed to delete notification',
        },
      });
    }
  }
}
