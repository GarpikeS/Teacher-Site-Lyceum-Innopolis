import { db } from '../../config/database';
import { HomeworkModel } from './homework.model';
import { logger } from '../../utils/logger';
import { CreateHomeworkDto, UpdateHomeworkDto } from '@code-platform/shared-types';

export class HomeworkService {
  static async getMyHomework(studentId: string) {
    return HomeworkModel.findByClassForStudent(studentId);
  }

  static async getHomeworkById(id: string) {
    const homework = await HomeworkModel.findById(id);
    if (!homework) throw new Error('Homework not found');
    return homework;
  }

  static async getTeacherHomework(teacherId: string) {
    return HomeworkModel.findByTeacher(teacherId);
  }

  static async createHomework(dto: CreateHomeworkDto, teacherId: string) {
    // Verify teacher owns the class
    const classCheck = await db.query(
      'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2',
      [dto.classId, teacherId]
    );
    if (classCheck.rows.length === 0) {
      throw new Error('Class not found or you are not the teacher');
    }

    // Create assignment and homework in a transaction
    return db.transaction(async (client) => {
      // Create standalone assignment (no lesson_id)
      const assignmentResult = await client.query(
        `INSERT INTO assignments (lesson_id, title, description, assignment_type, difficulty, starter_code, test_cases, validation_type, points, order_index, is_published)
         VALUES (NULL, $1, $2, 'code', $3, $4, $5, 'automatic', $6, 1, true)
         RETURNING id`,
        [
          dto.assignmentTitle,
          dto.assignmentDescription,
          dto.difficulty,
          dto.starterCode || '',
          JSON.stringify(dto.testCases),
          dto.points,
        ]
      );
      const assignmentId = assignmentResult.rows[0].id;

      // Create homework
      const homework = await client.query(
        `INSERT INTO homework (title, description, class_id, assignment_id, assigned_by, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, title, description, class_id as "classId", assignment_id as "assignmentId",
                   assigned_by as "assignedBy", deadline, is_published as "isPublished",
                   created_at as "createdAt", updated_at as "updatedAt"`,
        [dto.title, dto.description || null, dto.classId, assignmentId, teacherId, dto.deadline || null]
      );

      logger.info('Homework created', { homeworkId: homework.rows[0].id, teacherId });
      return homework.rows[0];
    });
  }

  static async updateHomework(id: string, dto: UpdateHomeworkDto, teacherId: string, userRole: string) {
    const homework = await HomeworkModel.findById(id);
    if (!homework) throw new Error('Homework not found');
    if (userRole !== 'admin' && homework.assignedBy !== teacherId) {
      throw new Error('Not authorized to update this homework');
    }

    return HomeworkModel.update(id, dto);
  }

  static async deleteHomework(id: string, teacherId: string, userRole: string) {
    const homework = await HomeworkModel.findById(id);
    if (!homework) throw new Error('Homework not found');
    if (userRole !== 'admin' && homework.assignedBy !== teacherId) {
      throw new Error('Not authorized to delete this homework');
    }

    await HomeworkModel.delete(id);
    logger.info('Homework deleted', { homeworkId: id, teacherId });
  }

  static async getSubmissions(homeworkId: string, teacherId: string, userRole: string) {
    const homework = await HomeworkModel.findById(homeworkId);
    if (!homework) throw new Error('Homework not found');
    if (userRole !== 'admin' && homework.assignedBy !== teacherId) {
      throw new Error('Not authorized to view submissions');
    }

    return HomeworkModel.getSubmissions(homeworkId);
  }
}
