import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { UsersModel } from './users.model';
import { logger } from '../../utils/logger';

export class UsersController {
  /**
   * GET /api/v1/users/stats/public
   * Get public platform statistics (no auth required)
   */
  static async getPublicStats(_req: Request, res: Response) {
    try {
      const stats = await UsersModel.getPublicStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Get public stats error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get stats' },
      });
    }
  }

  /**
   * GET /api/v1/users
   * Get all users (admin only)
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = req.query.role as string | undefined;

      const { users, total } = await UsersService.getAllUsers(page, limit, role);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error: any) {
      logger.error('Get users error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get users' },
      });
    }
  }

  /**
   * GET /api/v1/users/:id
   * Get user by ID (admin only)
   */
  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UsersService.getUserById(req.params.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  /**
   * PATCH /api/v1/users/:id/role
   * Update user role (admin only)
   */
  static async updateRole(req: Request, res: Response) {
    try {
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Role is required' },
        });
      }

      const user = await UsersService.updateRole(req.params.id, role);

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  /**
   * PATCH /api/v1/users/:id/active
   * Toggle user active status (admin only)
   */
  static async toggleActive(req: Request, res: Response) {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'isActive (boolean) is required' },
        });
      }

      const user = await UsersService.toggleActive(req.params.id, isActive);

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  /**
   * DELETE /api/v1/users/:id
   * Delete user (admin only)
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      await UsersService.deleteUser(req.params.id);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      });
    }
  }
}
