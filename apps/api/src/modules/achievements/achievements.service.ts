import { AchievementsModel } from './achievements.model';
import { logger } from '../../utils/logger';
import {
  Achievement,
  AchievementWithStatus,
  AchievementCriteria,
  CreateAchievementDto,
  UpdateAchievementDto,
} from '@code-platform/shared-types';

export class AchievementsService {
  /**
   * Get all achievements (with user status if authenticated)
   */
  static async getAllAchievements(userId?: string): Promise<AchievementWithStatus[] | Achievement[]> {
    if (userId) {
      const achievements = await AchievementsModel.findAllWithStatus(userId);
      // Calculate progress for each achievement
      return await Promise.all(
        achievements.map(async (achievement) => {
          if (!achievement.isEarned) {
            const progress = await this.calculateProgress(userId, achievement.criteria);
            return {
              ...achievement,
              progress: progress.current,
              progressTarget: progress.target,
            };
          }
          return achievement;
        })
      );
    }
    return await AchievementsModel.findAll();
  }

  /**
   * Get user's earned achievements
   */
  static async getUserAchievements(userId: string): Promise<AchievementWithStatus[]> {
    return await AchievementsModel.getUserAchievements(userId);
  }

  /**
   * Create achievement (admin)
   */
  static async createAchievement(dto: CreateAchievementDto): Promise<Achievement> {
    const existing = await AchievementsModel.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Achievement with this slug already exists');
    }

    const achievement = await AchievementsModel.create(dto);
    logger.info('Achievement created', { achievementId: achievement.id, slug: achievement.slug });
    return achievement;
  }

  /**
   * Update achievement (admin)
   */
  static async updateAchievement(id: string, dto: UpdateAchievementDto): Promise<Achievement> {
    const achievement = await AchievementsModel.update(id, dto);

    if (!achievement) {
      throw new Error('Achievement not found');
    }

    logger.info('Achievement updated', { achievementId: id });
    return achievement;
  }

  /**
   * Delete achievement (admin)
   */
  static async deleteAchievement(id: string): Promise<void> {
    const deleted = await AchievementsModel.delete(id);

    if (!deleted) {
      throw new Error('Achievement not found');
    }

    logger.info('Achievement deleted', { achievementId: id });
  }

  /**
   * Check and award all pending achievements for a user
   * Returns newly awarded achievements
   */
  static async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    const achievements = await AchievementsModel.findAll();
    const awarded: Achievement[] = [];

    for (const achievement of achievements) {
      const alreadyHas = await AchievementsModel.hasAchievement(userId, achievement.id);
      if (alreadyHas) continue;

      const earned = await this.checkCriteria(userId, achievement.criteria);
      if (earned) {
        await AchievementsModel.awardAchievement(userId, achievement.id);
        awarded.push(achievement);
        logger.info('Achievement awarded', {
          userId,
          achievementId: achievement.id,
          slug: achievement.slug,
        });
      }
    }

    return awarded;
  }

  /**
   * Check if user meets achievement criteria
   */
  private static async checkCriteria(userId: string, criteria: AchievementCriteria): Promise<boolean> {
    const target = criteria.count || 1;

    switch (criteria.type) {
      case 'lessons_completed': {
        const count = await AchievementsModel.getUserCompletedLessonsCount(userId);
        return count >= target;
      }
      case 'assignments_completed': {
        const count = await AchievementsModel.getUserPassedAssignmentsCount(userId);
        return count >= target;
      }
      case 'perfect_score': {
        const count = await AchievementsModel.getUserPerfectScoreCount(userId);
        return count >= target;
      }
      case 'course_completed': {
        const count = await AchievementsModel.getUserCompletedCoursesCount(userId);
        return count >= target;
      }
      case 'streak_days': {
        const streak = await AchievementsModel.getUserStreakDays(userId);
        return streak >= target;
      }
      default:
        return false;
    }
  }

  /**
   * Calculate progress towards an achievement
   */
  private static async calculateProgress(
    userId: string,
    criteria: AchievementCriteria
  ): Promise<{ current: number; target: number }> {
    const target = criteria.count || 1;
    let current = 0;

    switch (criteria.type) {
      case 'lessons_completed':
        current = await AchievementsModel.getUserCompletedLessonsCount(userId);
        break;
      case 'assignments_completed':
        current = await AchievementsModel.getUserPassedAssignmentsCount(userId);
        break;
      case 'perfect_score':
        current = await AchievementsModel.getUserPerfectScoreCount(userId);
        break;
      case 'course_completed':
        current = await AchievementsModel.getUserCompletedCoursesCount(userId);
        break;
      case 'streak_days':
        current = await AchievementsModel.getUserStreakDays(userId);
        break;
    }

    return { current: Math.min(current, target), target };
  }
}
