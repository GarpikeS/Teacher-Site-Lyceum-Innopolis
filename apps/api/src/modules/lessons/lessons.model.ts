import { db } from '../../config/database';
import {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  LessonWithProgress,
  UserProgress,
  LessonStatus,
} from '@code-platform/shared-types';

export class LessonsModel {
  /**
   * Get all lessons by course ID
   */
  static async findByCourseId(courseId: string, includeUnpublished: boolean = false): Promise<Lesson[]> {
    const query = `
      SELECT
        id, course_id as "courseId", slug, title, description, content,
        order_index as "orderIndex", duration_minutes as "durationMinutes",
        is_published as "isPublished", prerequisites,
        created_at as "createdAt", updated_at as "updatedAt"
      FROM lessons
      WHERE course_id = $1 ${includeUnpublished ? '' : 'AND is_published = true'}
      ORDER BY order_index ASC
    `;

    const result = await db.query<Lesson>(query, [courseId]);
    return result.rows;
  }

  /**
   * Get lesson by ID
   */
  static async findById(id: string): Promise<Lesson | null> {
    const result = await db.query<Lesson>(
      `SELECT
        id, course_id as "courseId", slug, title, description, content,
        order_index as "orderIndex", duration_minutes as "durationMinutes",
        is_published as "isPublished", prerequisites,
        created_at as "createdAt", updated_at as "updatedAt"
       FROM lessons WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Get lessons with user progress
   */
  static async findByCourseIdWithProgress(
    courseId: string,
    userId: string
  ): Promise<LessonWithProgress[]> {
    const result = await db.query<LessonWithProgress>(
      `SELECT
        l.id, l.course_id as "courseId", l.slug, l.title, l.description, l.content,
        l.order_index as "orderIndex", l.duration_minutes as "durationMinutes",
        l.is_published as "isPublished", l.prerequisites,
        l.created_at as "createdAt", l.updated_at as "updatedAt",
        COALESCE(up.status, 'not_started') as status,
        up.started_at as "startedAt", up.completed_at as "completedAt",
        COALESCE(up.time_spent_seconds, 0) as "timeSpentSeconds",
        up.last_accessed_at as "lastAccessedAt"
      FROM lessons l
      LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = $2
      WHERE l.course_id = $1 AND l.is_published = true
      ORDER BY l.order_index ASC`,
      [courseId, userId]
    );

    return result.rows;
  }

  /**
   * Create lesson
   */
  static async create(dto: CreateLessonDto): Promise<Lesson> {
    const result = await db.query<Lesson>(
      `INSERT INTO lessons (
        course_id, slug, title, description, content, order_index,
        duration_minutes, prerequisites
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id, course_id as "courseId", slug, title, description, content,
        order_index as "orderIndex", duration_minutes as "durationMinutes",
        is_published as "isPublished", prerequisites,
        created_at as "createdAt", updated_at as "updatedAt"`,
      [
        dto.courseId,
        dto.slug,
        dto.title,
        dto.description,
        dto.content,
        dto.orderIndex,
        dto.durationMinutes,
        dto.prerequisites || [],
      ]
    );

    return result.rows[0];
  }

  /**
   * Update lesson
   */
  static async update(id: string, dto: UpdateLessonDto): Promise<Lesson | null> {
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
    if (dto.content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      values.push(dto.content);
    }
    if (dto.orderIndex !== undefined) {
      updates.push(`order_index = $${paramIndex++}`);
      values.push(dto.orderIndex);
    }
    if (dto.durationMinutes !== undefined) {
      updates.push(`duration_minutes = $${paramIndex++}`);
      values.push(dto.durationMinutes);
    }
    if (dto.isPublished !== undefined) {
      updates.push(`is_published = $${paramIndex++}`);
      values.push(dto.isPublished);
    }
    if (dto.prerequisites !== undefined) {
      updates.push(`prerequisites = $${paramIndex++}`);
      values.push(dto.prerequisites);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await db.query<Lesson>(
      `UPDATE lessons
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING
         id, course_id as "courseId", slug, title, description, content,
         order_index as "orderIndex", duration_minutes as "durationMinutes",
         is_published as "isPublished", prerequisites,
         created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete lesson
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM lessons WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Get or create user progress
   */
  static async getOrCreateProgress(userId: string, lessonId: string): Promise<UserProgress> {
    const result = await db.query<UserProgress>(
      `INSERT INTO user_progress (user_id, lesson_id, status, started_at)
       VALUES ($1, $2, 'not_started', NOW())
       ON CONFLICT (user_id, lesson_id) DO UPDATE
       SET last_accessed_at = NOW()
       RETURNING
         id, user_id as "userId", lesson_id as "lessonId", status,
         started_at as "startedAt", completed_at as "completedAt",
         time_spent_seconds as "timeSpentSeconds", last_accessed_at as "lastAccessedAt"`,
      [userId, lessonId]
    );

    return result.rows[0];
  }

  /**
   * Start lesson
   */
  static async startLesson(userId: string, lessonId: string): Promise<UserProgress> {
    const result = await db.query<UserProgress>(
      `INSERT INTO user_progress (user_id, lesson_id, status, started_at)
       VALUES ($1, $2, 'in_progress', NOW())
       ON CONFLICT (user_id, lesson_id) DO UPDATE
       SET status = 'in_progress',
           started_at = COALESCE(user_progress.started_at, NOW()),
           last_accessed_at = NOW()
       RETURNING
         id, user_id as "userId", lesson_id as "lessonId", status,
         started_at as "startedAt", completed_at as "completedAt",
         time_spent_seconds as "timeSpentSeconds", last_accessed_at as "lastAccessedAt"`,
      [userId, lessonId]
    );

    return result.rows[0];
  }

  /**
   * Complete lesson
   */
  static async completeLesson(userId: string, lessonId: string): Promise<UserProgress> {
    const result = await db.query<UserProgress>(
      `INSERT INTO user_progress (user_id, lesson_id, status, started_at, completed_at)
       VALUES ($1, $2, 'completed', NOW(), NOW())
       ON CONFLICT (user_id, lesson_id) DO UPDATE
       SET status = 'completed',
           completed_at = NOW(),
           last_accessed_at = NOW()
       RETURNING
         id, user_id as "userId", lesson_id as "lessonId", status,
         started_at as "startedAt", completed_at as "completedAt",
         time_spent_seconds as "timeSpentSeconds", last_accessed_at as "lastAccessedAt"`,
      [userId, lessonId]
    );

    return result.rows[0];
  }

  /**
   * Update time spent on lesson
   */
  static async updateTimeSpent(
    userId: string,
    lessonId: string,
    additionalSeconds: number
  ): Promise<void> {
    await db.query(
      `UPDATE user_progress
       SET time_spent_seconds = time_spent_seconds + $3,
           last_accessed_at = NOW()
       WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId, additionalSeconds]
    );
  }
}
