import { db } from '../../config/database';
import {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  CourseWithProgress,
  CourseEnrollment,
} from '@code-platform/shared-types';

export class CoursesModel {
  /**
   * Get all courses
   */
  static async findAll(includeUnpublished: boolean = false): Promise<Course[]> {
    const query = `
      SELECT
        id, slug, title, description, language, level,
        icon_url as "iconUrl", cover_image_url as "coverImageUrl",
        is_published as "isPublished", order_index as "orderIndex",
        estimated_hours as "estimatedHours", created_by as "createdBy",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM courses
      ${includeUnpublished ? '' : 'WHERE is_published = true'}
      ORDER BY order_index ASC
    `;

    const result = await db.query<Course>(query);
    return result.rows;
  }

  /**
   * Get course by ID
   */
  static async findById(id: string): Promise<Course | null> {
    const result = await db.query<Course>(
      `SELECT
        id, slug, title, description, language, level,
        icon_url as "iconUrl", cover_image_url as "coverImageUrl",
        is_published as "isPublished", order_index as "orderIndex",
        estimated_hours as "estimatedHours", created_by as "createdBy",
        created_at as "createdAt", updated_at as "updatedAt"
       FROM courses WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Get course by slug
   */
  static async findBySlug(slug: string): Promise<Course | null> {
    const result = await db.query<Course>(
      `SELECT
        id, slug, title, description, language, level,
        icon_url as "iconUrl", cover_image_url as "coverImageUrl",
        is_published as "isPublished", order_index as "orderIndex",
        estimated_hours as "estimatedHours", created_by as "createdBy",
        created_at as "createdAt", updated_at as "updatedAt"
       FROM courses WHERE slug = $1`,
      [slug]
    );

    return result.rows[0] || null;
  }

  /**
   * Create course
   */
  static async create(dto: CreateCourseDto, createdBy: string): Promise<Course> {
    const result = await db.query<Course>(
      `INSERT INTO courses (
        slug, title, description, language, level, icon_url,
        cover_image_url, order_index, estimated_hours, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id, slug, title, description, language, level,
        icon_url as "iconUrl", cover_image_url as "coverImageUrl",
        is_published as "isPublished", order_index as "orderIndex",
        estimated_hours as "estimatedHours", created_by as "createdBy",
        created_at as "createdAt", updated_at as "updatedAt"`,
      [
        dto.slug,
        dto.title,
        dto.description,
        dto.language,
        dto.level || 'advanced',
        dto.iconUrl,
        dto.coverImageUrl,
        dto.orderIndex,
        dto.estimatedHours,
        createdBy,
      ]
    );

    return result.rows[0];
  }

  /**
   * Update course
   */
  static async update(id: string, dto: UpdateCourseDto): Promise<Course | null> {
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
    if (dto.coverImageUrl !== undefined) {
      updates.push(`cover_image_url = $${paramIndex++}`);
      values.push(dto.coverImageUrl);
    }
    if (dto.isPublished !== undefined) {
      updates.push(`is_published = $${paramIndex++}`);
      values.push(dto.isPublished);
    }
    if (dto.orderIndex !== undefined) {
      updates.push(`order_index = $${paramIndex++}`);
      values.push(dto.orderIndex);
    }
    if (dto.estimatedHours !== undefined) {
      updates.push(`estimated_hours = $${paramIndex++}`);
      values.push(dto.estimatedHours);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await db.query<Course>(
      `UPDATE courses
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING
         id, slug, title, description, language, level,
         icon_url as "iconUrl", cover_image_url as "coverImageUrl",
         is_published as "isPublished", order_index as "orderIndex",
         estimated_hours as "estimatedHours", created_by as "createdBy",
         created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete course
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM courses WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Get courses with user progress
   */
  static async findAllWithProgress(userId: string): Promise<CourseWithProgress[]> {
    const result = await db.query<CourseWithProgress>(
      `SELECT
        c.id, c.slug, c.title, c.description, c.language, c.level,
        c.icon_url as "iconUrl", c.cover_image_url as "coverImageUrl",
        c.is_published as "isPublished", c.order_index as "orderIndex",
        c.estimated_hours as "estimatedHours", c.created_by as "createdBy",
        c.created_at as "createdAt", c.updated_at as "updatedAt",
        COALESCE(ce.progress_percentage, 0) as "progressPercentage",
        COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN l.id END) as "completedLessons",
        COUNT(DISTINCT l.id) as "totalLessons",
        ce.enrolled_at as "enrolledAt",
        ce.last_accessed_at as "lastAccessedAt"
      FROM courses c
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.user_id = $1
      LEFT JOIN lessons l ON l.course_id = c.id AND l.is_published = true
      LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = $1
      WHERE c.is_published = true
      GROUP BY c.id, ce.progress_percentage, ce.enrolled_at, ce.last_accessed_at
      ORDER BY c.order_index ASC`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Check if user is enrolled in course
   */
  static async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const result = await db.query(
      'SELECT id FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    return result.rows.length > 0;
  }

  /**
   * Enroll user in course
   */
  static async enroll(userId: string, courseId: string): Promise<CourseEnrollment> {
    const result = await db.query<CourseEnrollment>(
      `INSERT INTO course_enrollments (user_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, course_id) DO UPDATE
       SET last_accessed_at = NOW()
       RETURNING
         id, user_id as "userId", course_id as "courseId",
         enrolled_at as "enrolledAt", progress_percentage as "progressPercentage",
         last_accessed_at as "lastAccessedAt", completed_at as "completedAt"`,
      [userId, courseId]
    );

    return result.rows[0];
  }

  /**
   * Get enrollment by user and course
   */
  static async getEnrollment(userId: string, courseId: string): Promise<CourseEnrollment | null> {
    const result = await db.query<CourseEnrollment>(
      `SELECT
         id, user_id as "userId", course_id as "courseId",
         enrolled_at as "enrolledAt", progress_percentage as "progressPercentage",
         last_accessed_at as "lastAccessedAt", completed_at as "completedAt"
       FROM course_enrollments
       WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );

    return result.rows[0] || null;
  }
}
