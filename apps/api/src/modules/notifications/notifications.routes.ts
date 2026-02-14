import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

/**
 * GET /api/v1/notifications
 * Get user's notifications (paginated: ?limit=20&offset=0)
 */
router.get('/', authenticate, NotificationsController.getNotifications);

/**
 * GET /api/v1/notifications/unread-count
 * Get unread notifications count
 */
router.get('/unread-count', authenticate, NotificationsController.getUnreadCount);

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', authenticate, NotificationsController.markAllAsRead);

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark notification as read
 */
router.patch('/:id/read', authenticate, NotificationsController.markAsRead);

/**
 * DELETE /api/v1/notifications/:id
 * Delete notification
 */
router.delete('/:id', authenticate, NotificationsController.deleteNotification);

export default router;
