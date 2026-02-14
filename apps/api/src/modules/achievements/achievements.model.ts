import { db } from '../../config/database';
import {
  Achievement,
  AchievementWithStatus,
  CreateAchievementDto,
  UpdateAchievementDto,
  UserAchievement,
} from '@code-platform/shared-types';

export class AchievementsModel {
  /**
   * Get all active achievements
   */
  static async findAll(): Promise<Achievement[]> {
    const result = await db.query<Achievement>(
      `SELECT
        id, slug, title, description,
        icon_url as "iconUrl",
        badge_color as "badgeColor",
        criteria, points,
        is_active as "isActive",
        created_at as "createdAt"
      FROM achievements
      WHERE is_active = true
      ORDER BY points ASC`
    );

    return result.rows;
  }

  /**
   * Get all achievements with user status
   */
  static async findAllWithStatus(userId: string): Promise<AchievementWithStatus[]> {
    const result = await db.query<AchievementWithStatus>(
      `SELECT
        a.id, a.slug, a.title, a.description,
        a.icon_url as "iconUrl",
        a.badge_color as "badgeColor",
        a.criteria, a.points,
        a.is_active as "isActive",
        a.created_at as "createdAt",
        CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as "isEarned",
        ua.earned_at as "earnedAt"
      FROM achievements a
      LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = $1
      WHERE a.is_active = true
      ORDER BY a.points ASC`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Get achievement by ID
   */
  static async findById(id: string): Promise<Achievement | null> {
    const result = await db.query<Achievement>(
      `SELECT
        id, slug, title, description,
        icon_url as "iconUrl",
        badge_color as "badgeColor",
        criteria, points,
        is_active as "isActive",
        created_at as "createdAt"
      FROM achievements WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Get achievement by slug
   */
  static async findBySlug(slug: string): Promise<Achievement | null> {
    const result = await db.query<Achievement>(
      `SELECT
        id, slug, title, description,
        icon_url as "iconUrl",
        badge_color as "badgeColor",
        criteria, points,
        is_active as "isActive",
        created_at as "createdAt"
      FROM achievements WHERE slug = $1`,
      [slug]
    );

    return result.rows[0] || null;
  }

  /**
   * Create achievement
   */
  static async create(dto: CreateAchievementDto): Promise<Achievement> {
    const result = await db.query<Achievement>(
      `INSERT INTO achievements (slug, title, description, icon_url, badge_color, criteria, points)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id, slug, title, description,
        icon_url as "iconUrl",
        badge_color as "badgeColor",
        criteria, points,
        is_active as "isActive",
        created_at as "createdAt"`,
      [
        dto.slug,
        dto.title,
        dto.description,
        dto.iconUrl,
        dto.badgeColor,
        JSON.stringify(dto.criteria),
        dto.points || 10,
      ]
    );

    return result.rows[0];
  }

  /**
   * Update achievement
   */
  static async update(id: string, dto: UpdateAchievementDto): Promise<Achievement | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(dto.description);
    }
    if (dto.iconUrl !== undefined) {
      updates.push(`icon_url = $${paramIndex++}`);
      values.push(dto.iconUrl);
    }
    if (dto.badgeColor !== undefined) {
      updates.push(`badge_color = $${paramIndex++}`);
      values.push(dto.badgeColor);
    }
    if (dto.criteria !== undefined) {
      updates.push(`criteria = $${paramIndex++}`);
      values.push(JSON.stringify(dto.criteria));
    }
    if (dto.points !== undefined) {
      updates.push(`points = $${paramIndex++}`);
      values.push(dto.points);
    }
    if (dto.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(dto.isActive);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await db.query<Achievement>(
      `UPDATE achievements
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING
        id, slug, title, description,
        icon_url as "iconUrl",
        badge_color as "badgeColor",
        criteria, points,
        is_active as "isActive",
        created_at as "createdAt"`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete achievement
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM achievements WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Get user's earned achievements
   */
  static async getUserAchievements(userId: string): Promise<AchievementWithStatus[]> {
    const result = await db.query<AchievementWithStatus>(
      `SELECT
        a.id, a.slug, a.title, a.description,
        a.icon_url as "iconUrl",
        a.badge_color as "badgeColor",
        a.criteria, a.points,
        a.is_active as "isActive",
        a.created_at as "createdAt",
        true as "isEarned",
        ua.earned_at as "earnedAt"
      FROM user_achievements ua
      JOIN achievements a ON a.id = ua.achievement_id
      WHERE ua.user_id = $1
      ORDER BY ua.earned_at DESC`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Check if user has achievement
   */
  static async hasAchievement(userId: string, achievementId: string): Promise<boolean> {
    const result = await db.query(
      'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
      [userId, achievementId]
    );
    return result.rows.length > 0;
  }

  /**
   * Award achievement to user
   */
  static async awardAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const result = await db.query<UserAchievement>(
      `INSERT INTO user_achievements (user_id, achievement_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, achievement_id) DO NOTHING
      RETURNING
        id, user_id as "userId",
        achievement_id as "achievementId",
        earned_at as "earnedAt"`,
      [userId, achievementId]
    );

    return result.rows[0];
  }

  /**
   * Get user's completed lessons count
   */
  static async getUserCompletedLessonsCount(userId: string): Promise<number> {
    const result = await db.query<{ count: number }>(
      "SELECT COUNT(*)::integer as count FROM user_progress WHERE user_id = $1 AND status = 'completed'",
      [userId]
    );
    return result.rows[0].count;
  }

  /**
   * Get user's passed assignments count
   */
  static async getUserPassedAssignmentsCount(userId: string): Promise<number> {
    const result = await db.query<{ count: number }>(
      "SELECT COUNT(DISTINCT assignment_id)::integer as count FROM submissions WHERE user_id = $1 AND status = 'passed'",
      [userId]
    );
    return result.rows[0].count;
  }

  /**
   * Check if user has a perfect score submission
   */
  static async getUserPerfectScoreCount(userId: string): Promise<number> {
    const result = await db.query<{ count: number }>(
      `SELECT COUNT(DISTINCT assignment_id)::integer as count
      FROM submissions
      WHERE user_id = $1 AND status = 'passed' AND score = max_score AND max_score > 0`,
      [userId]
    );
    return result.rows[0].count;
  }

  /**
   * Get user's completed courses count
   */
  static async getUserCompletedCoursesCount(userId: string): Promise<number> {
    const result = await db.query<{ count: number }>(
      'SELECT COUNT(*)::integer as count FROM course_enrollments WHERE user_id = $1 AND completed_at IS NOT NULL',
      [userId]
    );
    return result.rows[0].count;
  }

  /**
   * Get user's streak days (consecutive days with activity)
   */
  static async getUserStreakDays(userId: string): Promise<number> {
    const result = await db.query<{ activity_date: string }>(
      `SELECT DISTINCT DATE(submitted_at) as activity_date
      FROM submissions WHERE user_id = $1
      UNION
      SELECT DISTINCT DATE(last_accessed_at) as activity_date
      FROM user_progress WHERE user_id = $1
      ORDER BY activity_date DESC`,
      [userId]
    );

    if (result.rows.length === 0) return 0;

    let streak = 1;
    const dates = result.rows.map((r: { activity_date: string }) => new Date(r.activity_date));

    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i - 1].getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
