import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../auth/auth.middleware';
import { requireAdmin } from '../../middleware/rbac.middleware';

const router = Router();

/**
 * GET /api/v1/users/stats/public
 * Get public platform statistics (no auth required)
 */
router.get('/stats/public', UsersController.getPublicStats);

/**
 * GET /api/v1/users
 * List users with pagination and optional role filter
 */
router.get('/', authenticate, requireAdmin, UsersController.getAllUsers);

/**
 * GET /api/v1/users/:id
 * Get user by ID
 */
router.get('/:id', authenticate, requireAdmin, UsersController.getUserById);

/**
 * PATCH /api/v1/users/:id/role
 * Update user role
 */
router.patch('/:id/role', authenticate, requireAdmin, UsersController.updateRole);

/**
 * PATCH /api/v1/users/:id/active
 * Toggle user active status
 */
router.patch('/:id/active', authenticate, requireAdmin, UsersController.toggleActive);

/**
 * DELETE /api/v1/users/:id
 * Delete user
 */
router.delete('/:id', authenticate, requireAdmin, UsersController.deleteUser);

export default router;
