import { db } from '../../config/database';
import { logger } from '../../utils/logger';

export class TeacherService {
  static async getDashboard(teacherId: string) {
    // Get teacher's classes
    const classesResult = await db.query(
      `SELECT id FROM classes WHERE teacher_id = $1 AND is_active = true`,
      [teacherId]
    );
    const classIds = classesResult.rows.map((c: any) => c.id);

    let totalStudents = 0;
    let pendingReviews = 0;
    let recentSubmissions: any[] = [];

    if (classIds.length > 0) {
      // Count students
      const studentsResult = await db.query(
        `SELECT COUNT(DISTINCT student_id) as count FROM class_students WHERE class_id = ANY($1)`,
        [classIds]
      );
      totalStudents = parseInt(studentsResult.rows[0].count, 10);

      // Count pending reviews
      const pendingResult = await db.query(
        `SELECT COUNT(*) as count FROM submissions s
         JOIN class_students cs ON s.user_id = cs.student_id
         WHERE cs.class_id = ANY($1) AND s.status IN ('manual_review', 'pending')`,
        [classIds]
      );
      pendingReviews = parseInt(pendingResult.rows[0].count, 10);

      // Recent submissions
      const recentResult = await db.query(
        `SELECT s.id, s.status, s.score, s.max_score as "maxScore", s.created_at as "submittedAt",
                u.first_name || ' ' || u.last_name as "studentName",
                a.title as "assignmentTitle"
         FROM submissions s
         JOIN users u ON s.user_id = u.id
         JOIN assignments a ON s.assignment_id = a.id
         JOIN class_students cs ON s.user_id = cs.student_id
         WHERE cs.class_id = ANY($1)
         ORDER BY s.created_at DESC
         LIMIT 10`,
        [classIds]
      );
      recentSubmissions = recentResult.rows;
    }

    logger.debug('Teacher dashboard loaded', { teacherId, classes: classIds.length });

    return {
      totalClasses: classIds.length,
      totalStudents,
      pendingReviews,
      recentSubmissions,
    };
  }
}
