import { Request, Response } from 'express';
import { AchievementsService } from './achievements.service';
import { logger } from '../../utils/logger';
import { CreateAchievementDto, UpdateAchievementDto } from '@code-platform/shared-types';

export class AchievementsController {
  /**
   * GET /api/v1/achievements
   * Get all achievements (with progress if authenticated)
   */
  static async getAllAchievements(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const achievements = await AchievementsService.getAllAchievements(userId);

      res.json({
        success: true,
        data: achievements,
      });
    } catch (error: any) {
      logger.error('Get achievements error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get achievements',
        },
      });
    }
  }

  /**
   * GET /api/v1/achievements/my
   * Get user's earned achievements
   */
  static async getMyAchievements(req: Request, res: Response) {
    try {
      const user = req.user!;
      const achievements = await AchievementsService.getUserAchievements(user.id);

      res.json({
        success: true,
        data: achievements,
      });
    } catch (error: any) {
      logger.error('Get user achievements error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get achievements',
        },
      });
    }
  }

  /**
   * POST /api/v1/achievements
   * Create achievement (Admin only)
   */
  static async createAchievement(req: Request, res: Response) {
    try {
      const dto: CreateAchievementDto = req.body;

      if (!dto.slug || !dto.title || !dto.criteria) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: slug, title, criteria',
          },
        });
      }

      const achievement = await AchievementsService.createAchievement(dto);

      res.status(201).json({
        success: true,
        data: achievement,
      });
    } catch (error: any) {
      logger.error('Create achievement error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error.message || 'Failed to create achievement',
        },
      });
    }
  }

  /**
   * PATCH /api/v1/achievements/:id
   * Update achievement (Admin only)
   */
  static async updateAchievement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateAchievementDto = req.body;

      const achievement = await AchievementsService.updateAchievement(id, dto);

      res.json({
        success: true,
        data: achievement,
      });
    } catch (error: any) {
      logger.error('Update achievement error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'UPDATE_ERROR',
          message: error.message || 'Failed to update achievement',
        },
      });
    }
  }

  /**
   * DELETE /api/v1/achievements/:id
   * Delete achievement (Admin only)
   */
  static async deleteAchievement(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await AchievementsService.deleteAchievement(id);

      res.json({
        success: true,
        message: 'Achievement deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete achievement error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'DELETE_ERROR',
          message: error.message || 'Failed to delete achievement',
        },
      });
    }
  }

  /**
   * POST /api/v1/achievements/check
   * Check & award pending achievements for current user
   */
  static async checkAchievements(req: Request, res: Response) {
    try {
      const user = req.user!;
      const awarded = await AchievementsService.checkAndAwardAchievements(user.id);

      res.json({
        success: true,
        data: {
          awarded,
          count: awarded.length,
        },
      });
    } catch (error: any) {
      logger.error('Check achievements error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to check achievements',
        },
      });
    }
  }
}
