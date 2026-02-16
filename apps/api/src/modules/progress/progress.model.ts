import { db } from '../../config/database';

export interface UserProgressSummary {
  enrolledCourses: number;
  completedLessons: number;
  passedAssignments: number;
  earnedAchievements: number;
  totalPoints: number;
  currentStreak: number;
}

export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lessonsProgress: Array<{
    lessonId: string;
    lessonTitle: string;
    status: string;
    completedAt?: Date;
  }>;
}

export class ProgressModel {
  static async getUserSummary(userId: string): Promise<UserProgressSummary> {
    const result = await db.query<UserProgressSummary>(
      `SELECT
        (SELECT COUNT(*) FROM course_enrollments WHERE user_id = $1)::int as "enrolledCourses",
        (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed')::int as "completedLessons",
        (SELECT COUNT(*) FROM submissions WHERE user_id = $1 AND status = 'passed')::int as "passedAssignments",
        (SELECT COUNT(*) FROM user_achievements WHERE user_id = $1)::int as "earnedAchievements",
        COALESCE((SELECT SUM(score) FROM submissions WHERE user_id = $1 AND status = 'passed'), 0)::int as "totalPoints",
        0 as "currentStreak"`,
      [userId]
    );
    return result.rows[0];
  }

  static async getCourseProgress(courseId: string, userId: string): Promise<CourseProgress | null> {
    // Get course info
    const courseResult = await db.query(
      `SELECT id as "courseId", title as "courseTitle"
       FROM courses WHERE id = $1`,
      [courseId]
    );

    if (courseResult.rows.length === 0) return null;

    const course = courseResult.rows[0];

    // Get lesson progress
    const lessonsResult = await db.query(
      `SELECT
        l.id as "lessonId",
        l.title as "lessonTitle",
        COALESCE(up.status, 'not_started') as status,
        up.completed_at as "completedAt"
       FROM lessons l
       LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = $2
       WHERE l.course_id = $1 AND l.is_published = true
       ORDER BY l.order_index ASC`,
      [courseId, userId]
    );

    const lessonsProgress = lessonsResult.rows;
    const totalLessons = lessonsProgress.length;
    const completedLessons = lessonsProgress.filter((l: any) => l.status === 'completed').length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      ...course,
      progressPercentage,
      completedLessons,
      totalLessons,
      lessonsProgress,
    };
  }

  static async getRecentActivity(userId: string, limit: number = 10): Promise<any[]> {
    const result = await db.query(
      `(SELECT
        s.id, 'submission' as type,
        a.title as title,
        s.submitted_at as timestamp
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       WHERE s.user_id = $1
       ORDER BY s.submitted_at DESC
       LIMIT $2)
      UNION ALL
      (SELECT
        up.id, 'lesson_progress' as type,
        l.title as title,
        up.last_accessed_at as timestamp
       FROM user_progress up
       JOIN lessons l ON l.id = up.lesson_id
       WHERE up.user_id = $1
       ORDER BY up.last_accessed_at DESC
       LIMIT $2)
      ORDER BY timestamp DESC
      LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }
}
