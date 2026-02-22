import { db } from '../../config/database';
import { Submission, CreateSubmissionDto } from '@code-platform/shared-types';

const SUBMISSION_COLUMNS = `
  id, assignment_id as "assignmentId", user_id as "userId", code, language,
  status, test_results as "testResults", execution_time_ms as "executionTimeMs",
  memory_used_mb as "memoryUsedMb", score, max_score as "maxScore",
  teacher_feedback as "teacherFeedback", reviewed_by as "reviewedBy",
  reviewed_at as "reviewedAt", attempt_number as "attemptNumber",
  submitted_at as "submittedAt", graded_at as "gradedAt"
`;

export class SubmissionsModel {
  static async findById(id: string): Promise<Submission | null> {
    const result = await db.query<Submission>(
      `SELECT ${SUBMISSION_COLUMNS} FROM submissions WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByAssignmentAndUser(assignmentId: string, userId: string): Promise<Submission[]> {
    const result = await db.query<Submission>(
      `SELECT ${SUBMISSION_COLUMNS} FROM submissions
       WHERE assignment_id = $1 AND user_id = $2
       ORDER BY attempt_number DESC`,
      [assignmentId, userId]
    );
    return result.rows;
  }

  static async findByAssignment(assignmentId: string): Promise<Submission[]> {
    const result = await db.query<Submission>(
      `SELECT ${SUBMISSION_COLUMNS} FROM submissions
       WHERE assignment_id = $1
       ORDER BY submitted_at DESC`,
      [assignmentId]
    );
    return result.rows;
  }

  static async findByUser(userId: string, limit: number = 20): Promise<Submission[]> {
    const result = await db.query<Submission>(
      `SELECT ${SUBMISSION_COLUMNS} FROM submissions
       WHERE user_id = $1
       ORDER BY submitted_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  static async getAttemptCount(assignmentId: string, userId: string): Promise<number> {
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM submissions
       WHERE assignment_id = $1 AND user_id = $2`,
      [assignmentId, userId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  static async create(dto: CreateSubmissionDto, userId: string, attemptNumber: number): Promise<Submission> {
    const result = await db.query<Submission>(
      `INSERT INTO submissions (assignment_id, user_id, code, language, status, attempt_number)
       VALUES ($1, $2, $3, $4, 'pending', $5)
       RETURNING ${SUBMISSION_COLUMNS}`,
      [dto.assignmentId, userId, dto.code, dto.language, attemptNumber]
    );
    return result.rows[0];
  }

  static async updateStatus(
    id: string,
    status: string,
    testResults?: any,
    executionTimeMs?: number,
    memoryUsedMb?: number,
    score?: number,
    maxScore?: number
  ): Promise<Submission | null> {
    const result = await db.query<Submission>(
      `UPDATE submissions SET
        status = $2,
        test_results = COALESCE($3, test_results),
        execution_time_ms = COALESCE($4, execution_time_ms),
        memory_used_mb = COALESCE($5, memory_used_mb),
        score = COALESCE($6, score),
        max_score = COALESCE($7, max_score)
       WHERE id = $1
       RETURNING ${SUBMISSION_COLUMNS}`,
      [id, status, testResults ? JSON.stringify(testResults) : null, executionTimeMs, memoryUsedMb, score, maxScore]
    );
    return result.rows[0] || null;
  }

  static async addReview(
    id: string,
    reviewedBy: string,
    teacherFeedback: string,
    score?: number
  ): Promise<Submission | null> {
    const result = await db.query<Submission>(
      `UPDATE submissions SET
        teacher_feedback = $2,
        reviewed_by = $3,
        reviewed_at = NOW(),
        score = COALESCE($4, score),
        status = CASE WHEN $4 IS NOT NULL AND $4 > 0 THEN 'passed' ELSE status END
       WHERE id = $1
       RETURNING ${SUBMISSION_COLUMNS}`,
      [id, teacherFeedback, reviewedBy, score]
    );
    return result.rows[0] || null;
  }

  static async findPendingReviews(): Promise<Submission[]> {
    const result = await db.query<Submission>(
      `SELECT ${SUBMISSION_COLUMNS} FROM submissions
       WHERE status = 'manual_review'
       ORDER BY submitted_at ASC`
    );
    return result.rows;
  }
}
