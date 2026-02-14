import { db } from '../../config/database';
import { Assignment, CreateAssignmentDto, UpdateAssignmentDto } from '@code-platform/shared-types';

export class AssignmentsModel {
  static async findByLessonId(lessonId: string, includeUnpublished: boolean = false): Promise<Assignment[]> {
    const query = `
      SELECT id, lesson_id as "lessonId", title, description, assignment_type as "assignmentType",
             difficulty, starter_code as "starterCode", test_cases as "testCases",
             validation_type as "validationType", max_attempts as "maxAttempts",
             time_limit_seconds as "timeLimitSeconds", memory_limit_mb as "memoryLimitMb",
             points, order_index as "orderIndex", is_published as "isPublished",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM assignments WHERE lesson_id = $1 ${includeUnpublished ? '' : 'AND is_published = true'}
      ORDER BY order_index ASC
    `;
    const result = await db.query<Assignment>(query, [lessonId]);
    return result.rows;
  }

  static async findById(id: string): Promise<Assignment | null> {
    const result = await db.query<Assignment>(
      `SELECT id, lesson_id as "lessonId", title, description, assignment_type as "assignmentType",
              difficulty, starter_code as "starterCode", test_cases as "testCases",
              validation_type as "validationType", max_attempts as "maxAttempts",
              time_limit_seconds as "timeLimitSeconds", memory_limit_mb as "memoryLimitMb",
              points, order_index as "orderIndex", is_published as "isPublished",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM assignments WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(dto: CreateAssignmentDto): Promise<Assignment> {
    const result = await db.query<Assignment>(
      `INSERT INTO assignments (lesson_id, title, description, assignment_type, difficulty,
                                starter_code, test_cases, validation_type, max_attempts,
                                time_limit_seconds, memory_limit_mb, points, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, lesson_id as "lessonId", title, description, assignment_type as "assignmentType",
                 difficulty, starter_code as "starterCode", test_cases as "testCases",
                 validation_type as "validationType", max_attempts as "maxAttempts",
                 time_limit_seconds as "timeLimitSeconds", memory_limit_mb as "memoryLimitMb",
                 points, order_index as "orderIndex", is_published as "isPublished",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [dto.lessonId, dto.title, dto.description, dto.assignmentType || 'code', dto.difficulty,
       dto.starterCode, JSON.stringify(dto.testCases || []), dto.validationType || 'automatic',
       dto.maxAttempts || 0, dto.timeLimitSeconds, dto.memoryLimitMb, dto.points || 10, dto.orderIndex]
    );
    return result.rows[0];
  }

  static async update(id: string, dto: UpdateAssignmentDto): Promise<Assignment | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.title !== undefined) { updates.push(`title = $${paramIndex++}`); values.push(dto.title); }
    if (dto.description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(dto.description); }
    if (dto.starterCode !== undefined) { updates.push(`starter_code = $${paramIndex++}`); values.push(dto.starterCode); }
    if (dto.testCases !== undefined) { updates.push(`test_cases = $${paramIndex++}`); values.push(JSON.stringify(dto.testCases)); }
    if (dto.validationType !== undefined) { updates.push(`validation_type = $${paramIndex++}`); values.push(dto.validationType); }
    if (dto.maxAttempts !== undefined) { updates.push(`max_attempts = $${paramIndex++}`); values.push(dto.maxAttempts); }
    if (dto.timeLimitSeconds !== undefined) { updates.push(`time_limit_seconds = $${paramIndex++}`); values.push(dto.timeLimitSeconds); }
    if (dto.memoryLimitMb !== undefined) { updates.push(`memory_limit_mb = $${paramIndex++}`); values.push(dto.memoryLimitMb); }
    if (dto.points !== undefined) { updates.push(`points = $${paramIndex++}`); values.push(dto.points); }
    if (dto.orderIndex !== undefined) { updates.push(`order_index = $${paramIndex++}`); values.push(dto.orderIndex); }
    if (dto.isPublished !== undefined) { updates.push(`is_published = $${paramIndex++}`); values.push(dto.isPublished); }

    if (updates.length === 0) return this.findById(id);
    values.push(id);

    const result = await db.query<Assignment>(
      `UPDATE assignments SET ${updates.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, lesson_id as "lessonId", title, description, assignment_type as "assignmentType",
                 difficulty, starter_code as "starterCode", test_cases as "testCases",
                 validation_type as "validationType", max_attempts as "maxAttempts",
                 time_limit_seconds as "timeLimitSeconds", memory_limit_mb as "memoryLimitMb",
                 points, order_index as "orderIndex", is_published as "isPublished",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM assignments WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}
