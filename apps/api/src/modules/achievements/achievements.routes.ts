import { Router } from 'express';
import { AchievementsController } from './achievements.controller';
import { authenticate, optionalAuthenticate } from '../auth/auth.middleware';
import { requireAdmin } from '../../middleware/rbac.middleware';

const router = Router();

/**
 * GET /api/v1/achievements
 * Get all achievements (with progress if authenticated)
 */
router.get('/', optionalAuthenticate, AchievementsController.getAllAchievements);

/**
 * GET /api/v1/achievements/my
 * Get user's earned achievements
 */
router.get('/my', authenticate, AchievementsController.getMyAchievements);

/**
 * POST /api/v1/achievements/check
 * Check & award pending achievements
 */
router.post('/check', authenticate, AchievementsController.checkAchievements);

/**
 * POST /api/v1/achievements
 * Create achievement (Admin only)
 */
router.post('/', authenticate, requireAdmin, AchievementsController.createAchievement);

/**
 * PATCH /api/v1/achievements/:id
 * Update achievement (Admin only)
 */
router.patch('/:id', authenticate, requireAdmin, AchievementsController.updateAchievement);

/**
 * DELETE /api/v1/achievements/:id
 * Delete achievement (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, AchievementsController.deleteAchievement);

export default router;
