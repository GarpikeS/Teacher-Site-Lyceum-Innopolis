import { db } from '../../config/database';
import {
  Class,
  ClassWithStudents,
  CreateClassDto,
  UpdateClassDto,
  ClassStatistics,
} from '@code-platform/shared-types';

export class ClassesModel {
  /**
   * Get all classes by teacher ID
   */
  static async findByTeacherId(teacherId: string): Promise<ClassWithStudents[]> {
    const result = await db.query<ClassWithStudents>(
      `SELECT
        c.id, c.name, c.description,
        c.teacher_id as "teacherId",
        c.academic_year as "academicYear",
        c.is_active as "isActive",
        c.created_at as "createdAt",
        c.updated_at as "updatedAt",
        COUNT(cs.id)::integer as "studentsCount"
      FROM classes c
      LEFT JOIN class_students cs ON cs.class_id = c.id
      WHERE c.teacher_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC`,
      [teacherId]
    );

    return result.rows;
  }

  /**
   * Get all classes (admin)
   */
  static async findAll(): Promise<ClassWithStudents[]> {
    const result = await db.query<ClassWithStudents>(
      `SELECT
        c.id, c.name, c.description,
        c.teacher_id as "teacherId",
        c.academic_year as "academicYear",
        c.is_active as "isActive",
        c.created_at as "createdAt",
        c.updated_at as "updatedAt",
        COUNT(cs.id)::integer as "studentsCount"
      FROM classes c
      LEFT JOIN class_students cs ON cs.class_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC`
    );

    return result.rows;
  }

  /**
   * Get class by ID with students
   */
  static async findByIdWithStudents(id: string): Promise<ClassWithStudents | null> {
    const classResult = await db.query<ClassWithStudents>(
      `SELECT
        c.id, c.name, c.description,
        c.teacher_id as "teacherId",
        c.academic_year as "academicYear",
        c.is_active as "isActive",
        c.created_at as "createdAt",
        c.updated_at as "updatedAt",
        COUNT(cs.id)::integer as "studentsCount"
      FROM classes c
      LEFT JOIN class_students cs ON cs.class_id = c.id
      WHERE c.id = $1
      GROUP BY c.id`,
      [id]
    );

    const classData = classResult.rows[0];
    if (!classData) return null;

    const studentsResult = await db.query(
      `SELECT
        u.id, u.first_name as "firstName",
        u.last_name as "lastName", u.email,
        cs.joined_at as "joinedAt"
      FROM class_students cs
      JOIN users u ON u.id = cs.student_id
      WHERE cs.class_id = $1
      ORDER BY u.last_name ASC, u.first_name ASC`,
      [id]
    );

    classData.students = studentsResult.rows;
    return classData;
  }

  /**
   * Get class by ID (basic)
   */
  static async findById(id: string): Promise<Class | null> {
    const result = await db.query<Class>(
      `SELECT
        id, name, description,
        teacher_id as "teacherId",
        academic_year as "academicYear",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM classes WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Create class
   */
  static async create(dto: CreateClassDto, teacherId: string): Promise<Class> {
    const result = await db.query<Class>(
      `INSERT INTO classes (name, description, academic_year, teacher_id)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id, name, description,
        teacher_id as "teacherId",
        academic_year as "academicYear",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [dto.name, dto.description, dto.academicYear, teacherId]
    );

    return result.rows[0];
  }

  /**
   * Update class
   */
  static async update(id: string, dto: UpdateClassDto): Promise<Class | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(dto.name);
    }
    if (dto.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(dto.description);
    }
    if (dto.academicYear !== undefined) {
      updates.push(`academic_year = $${paramIndex++}`);
      values.push(dto.academicYear);
    }
    if (dto.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(dto.isActive);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await db.query<Class>(
      `UPDATE classes
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING
        id, name, description,
        teacher_id as "teacherId",
        academic_year as "academicYear",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete class
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM classes WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Add student to class
   */
  static async addStudent(classId: string, studentId: string): Promise<void> {
    await db.query(
      `INSERT INTO class_students (class_id, student_id)
      VALUES ($1, $2)
      ON CONFLICT (class_id, student_id) DO NOTHING`,
      [classId, studentId]
    );
  }

  /**
   * Remove student from class
   */
  static async removeStudent(classId: string, studentId: string): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM class_students WHERE class_id = $1 AND student_id = $2',
      [classId, studentId]
    );
    return (result.rowCount || 0) > 0;
  }

  /**
   * Check if student is in class
   */
  static async isStudentInClass(classId: string, studentId: string): Promise<boolean> {
    const result = await db.query(
      'SELECT id FROM class_students WHERE class_id = $1 AND student_id = $2',
      [classId, studentId]
    );
    return result.rows.length > 0;
  }

  /**
   * Get class statistics
   */
  static async getStatistics(classId: string): Promise<ClassStatistics | null> {
    const classData = await this.findById(classId);
    if (!classData) return null;

    // Get students count
    const countResult = await db.query<{ count: number }>(
      'SELECT COUNT(*)::integer as count FROM class_students WHERE class_id = $1',
      [classId]
    );

    // Get aggregated progress for class students
    const statsResult = await db.query(
      `SELECT
        COALESCE(AVG(ce.progress_percentage), 0)::decimal as "averageProgress",
        COALESCE(COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.id END), 0)::integer as "completedLessons",
        COALESCE(AVG(s.score), 0)::decimal as "averageScore"
      FROM class_students cs
      LEFT JOIN course_enrollments ce ON ce.user_id = cs.student_id
      LEFT JOIN user_progress up ON up.user_id = cs.student_id
      LEFT JOIN submissions s ON s.user_id = cs.student_id AND s.status = 'passed'
      WHERE cs.class_id = $1`,
      [classId]
    );

    // Get total lessons count
    const lessonsResult = await db.query<{ count: number }>(
      "SELECT COUNT(*)::integer as count FROM lessons WHERE is_published = true"
    );

    // Get top students
    const topStudentsResult = await db.query(
      `SELECT
        u.id, u.first_name as "firstName", u.last_name as "lastName",
        COALESCE(AVG(ce.progress_percentage), 0)::decimal as progress,
        COALESCE(SUM(s.score), 0)::integer as score
      FROM class_students cs
      JOIN users u ON u.id = cs.student_id
      LEFT JOIN course_enrollments ce ON ce.user_id = cs.student_id
      LEFT JOIN submissions s ON s.user_id = cs.student_id AND s.status = 'passed'
      WHERE cs.class_id = $1
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY progress DESC, score DESC
      LIMIT 5`,
      [classId]
    );

    const stats = statsResult.rows[0];

    return {
      classId,
      className: classData.name,
      studentsCount: countResult.rows[0].count,
      averageProgress: parseFloat(stats.averageProgress) || 0,
      completedLessons: stats.completedLessons,
      totalLessons: lessonsResult.rows[0].count,
      averageScore: parseFloat(stats.averageScore) || 0,
      topStudents: topStudentsResult.rows,
    };
  }
}
