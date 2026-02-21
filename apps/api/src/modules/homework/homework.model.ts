import { db } from '../../config/database';

export class HomeworkModel {
  static async findByClassForStudent(studentId: string) {
    const result = await db.query(
      `SELECT h.id, h.title, h.description, h.deadline, h.is_published as "isPublished",
              h.class_id as "classId", h.assignment_id as "assignmentId",
              h.assigned_by as "assignedBy", h.created_at as "createdAt",
              c.name as "className",
              a.title as "assignmentTitle", a.description as "assignmentDescription",
              a.difficulty as "assignmentDifficulty", a.points as "assignmentPoints",
              u.first_name as "teacherFirstName", u.last_name as "teacherLastName",
              s.status as "submissionStatus", s.score as "submissionScore",
              s.submitted_at as "submittedAt"
       FROM homework h
       JOIN classes c ON h.class_id = c.id
       JOIN assignments a ON h.assignment_id = a.id
       JOIN users u ON h.assigned_by = u.id
       JOIN class_students cs ON cs.class_id = h.class_id AND cs.student_id = $1
       LEFT JOIN submissions s ON s.assignment_id = h.assignment_id AND s.user_id = $1
         AND s.id = (SELECT id FROM submissions WHERE assignment_id = h.assignment_id AND user_id = $1 ORDER BY submitted_at DESC LIMIT 1)
       WHERE h.is_published = true
       ORDER BY h.deadline ASC NULLS LAST, h.created_at DESC`,
      [studentId]
    );
    return result.rows;
  }

  static async findById(id: string) {
    const result = await db.query(
      `SELECT h.id, h.title, h.description, h.deadline, h.is_published as "isPublished",
              h.class_id as "classId", h.assignment_id as "assignmentId",
              h.assigned_by as "assignedBy", h.created_at as "createdAt", h.updated_at as "updatedAt",
              c.name as "className",
              a.title as "assignmentTitle", a.description as "assignmentDescription",
              a.difficulty as "assignmentDifficulty", a.starter_code as "assignmentStarterCode",
              a.test_cases as "assignmentTestCases", a.points as "assignmentPoints",
              u.first_name as "teacherFirstName", u.last_name as "teacherLastName"
       FROM homework h
       JOIN classes c ON h.class_id = c.id
       JOIN assignments a ON h.assignment_id = a.id
       JOIN users u ON h.assigned_by = u.id
       WHERE h.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByTeacher(teacherId: string) {
    const result = await db.query(
      `SELECT h.id, h.title, h.description, h.deadline, h.is_published as "isPublished",
              h.class_id as "classId", h.assignment_id as "assignmentId",
              h.created_at as "createdAt",
              c.name as "className",
              a.title as "assignmentTitle", a.difficulty as "assignmentDifficulty",
              a.points as "assignmentPoints",
              (SELECT COUNT(*) FROM class_students WHERE class_id = h.class_id)::int as "studentsCount",
              (SELECT COUNT(*) FROM submissions WHERE assignment_id = h.assignment_id)::int as "submissionsCount"
       FROM homework h
       JOIN classes c ON h.class_id = c.id
       JOIN assignments a ON h.assignment_id = a.id
       WHERE h.assigned_by = $1
       ORDER BY h.created_at DESC`,
      [teacherId]
    );
    return result.rows;
  }

  static async create(data: {
    title: string;
    description?: string;
    classId: string;
    assignmentId: string;
    assignedBy: string;
    deadline?: string;
  }) {
    const result = await db.query(
      `INSERT INTO homework (title, description, class_id, assignment_id, assigned_by, deadline)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, class_id as "classId", assignment_id as "assignmentId",
                 assigned_by as "assignedBy", deadline, is_published as "isPublished",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [data.title, data.description || null, data.classId, data.assignmentId, data.assignedBy, data.deadline || null]
    );
    return result.rows[0];
  }

  static async update(id: string, data: { title?: string; description?: string; deadline?: string; isPublished?: boolean }) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.deadline !== undefined) { fields.push(`deadline = $${idx++}`); values.push(data.deadline); }
    if (data.isPublished !== undefined) { fields.push(`is_published = $${idx++}`); values.push(data.isPublished); }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query(
      `UPDATE homework SET ${fields.join(', ')} WHERE id = $${idx}
       RETURNING id, title, description, class_id as "classId", assignment_id as "assignmentId",
                 assigned_by as "assignedBy", deadline, is_published as "isPublished",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: string) {
    await db.query('DELETE FROM homework WHERE id = $1', [id]);
  }

  static async getSubmissions(homeworkId: string) {
    const result = await db.query(
      `SELECT s.id, s.user_id as "userId", s.code, s.language, s.status,
              s.test_results as "testResults", s.score, s.max_score as "maxScore",
              s.submitted_at as "submittedAt",
              u.first_name as "firstName", u.last_name as "lastName", u.email
       FROM homework h
       JOIN submissions s ON s.assignment_id = h.assignment_id
       JOIN users u ON s.user_id = u.id
       WHERE h.id = $1
       ORDER BY s.submitted_at DESC`,
      [homeworkId]
    );
    return result.rows;
  }
}
