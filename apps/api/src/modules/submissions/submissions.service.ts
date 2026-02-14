import { SubmissionsModel } from './submissions.model';
import { AssignmentsModel } from '../assignments/assignments.model';
import { AchievementsService } from '../achievements/achievements.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSubmissionDto, ReviewSubmissionDto, Submission } from '@code-platform/shared-types';
import { createError } from '../../middleware/error-handler.middleware';
import { config } from '../../config/environment';
import { logger } from '../../utils/logger';

export class SubmissionsService {
  static async getSubmissionById(id: string): Promise<Submission> {
    const submission = await SubmissionsModel.findById(id);
    if (!submission) {
      throw createError('Submission not found', 404, 'NOT_FOUND');
    }
    return submission;
  }

  static async getSubmissionsByAssignment(assignmentId: string, userId?: string): Promise<Submission[]> {
    if (userId) {
      return SubmissionsModel.findByAssignmentAndUser(assignmentId, userId);
    }
    return SubmissionsModel.findByAssignment(assignmentId);
  }

  static async getMySubmissions(userId: string): Promise<Submission[]> {
    return SubmissionsModel.findByUser(userId);
  }

  static async createSubmission(dto: CreateSubmissionDto, userId: string): Promise<Submission> {
    // Verify assignment exists
    const assignment = await AssignmentsModel.findById(dto.assignmentId);
    if (!assignment) {
      throw createError('Assignment not found', 404, 'NOT_FOUND');
    }

    // Check max attempts
    if (assignment.maxAttempts > 0) {
      const attemptCount = await SubmissionsModel.getAttemptCount(dto.assignmentId, userId);
      if (attemptCount >= assignment.maxAttempts) {
        throw createError(
          `Maximum attempts (${assignment.maxAttempts}) reached`,
          400,
          'MAX_ATTEMPTS_REACHED'
        );
      }
    }

    // Calculate attempt number
    const attemptCount = await SubmissionsModel.getAttemptCount(dto.assignmentId, userId);
    const attemptNumber = attemptCount + 1;

    // Create submission
    const submission = await SubmissionsModel.create(dto, userId, attemptNumber);
    logger.info(`Submission created: ${submission.id} by user ${userId} for assignment ${dto.assignmentId}`);

    // Trigger code execution asynchronously
    this.triggerExecution(submission.id, dto, assignment, userId).catch(err => {
      logger.error(`Execution trigger failed for submission ${submission.id}:`, err.message);
    });

    return submission;
  }

  private static async triggerExecution(
    submissionId: string,
    dto: CreateSubmissionDto,
    assignment: any,
    userId: string
  ): Promise<void> {
    try {
      // Update status to running
      await SubmissionsModel.updateStatus(submissionId, 'running');

      // Call code executor service
      const response = await fetch(`${config.executorUrl}/api/v1/code/execute/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: dto.code,
          language: dto.language,
          testCases: assignment.testCases || [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Executor returned ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const { passedTests, totalTests, details, totalExecutionTime } = result.data;
        const score = totalTests > 0
          ? Math.round((passedTests / totalTests) * (assignment.points || 10))
          : 0;
        const status = passedTests === totalTests ? 'passed' : 'failed';

        await SubmissionsModel.updateStatus(
          submissionId,
          assignment.validationType === 'manual' ? 'manual_review' : status,
          { passedTests, totalTests, details },
          totalExecutionTime,
          undefined,
          score,
          assignment.points || 10
        );

        logger.info(`Submission ${submissionId}: ${passedTests}/${totalTests} tests passed, score: ${score}`);

        // Check achievements after passed submission
        if (status === 'passed') {
          try {
            const awarded = await AchievementsService.checkAndAwardAchievements(userId);
            for (const achievement of awarded) {
              await NotificationsService.notifyAchievementEarned(userId, achievement.title);
            }
          } catch (err: any) {
            logger.error('Achievement check failed after submission', { error: err.message });
          }
        }
      } else {
        await SubmissionsModel.updateStatus(submissionId, 'error', null, 0, 0, 0);
      }
    } catch (error: any) {
      logger.error(`Execution failed for submission ${submissionId}:`, error.message);
      await SubmissionsModel.updateStatus(submissionId, 'error');
    }
  }

  static async reviewSubmission(id: string, reviewerId: string, dto: ReviewSubmissionDto): Promise<Submission> {
    const submission = await SubmissionsModel.findById(id);
    if (!submission) {
      throw createError('Submission not found', 404, 'NOT_FOUND');
    }

    const reviewed = await SubmissionsModel.addReview(id, reviewerId, dto.teacherFeedback, dto.score);
    if (!reviewed) {
      throw createError('Failed to update submission', 500, 'UPDATE_ERROR');
    }

    logger.info(`Submission ${id} reviewed by ${reviewerId}`);

    // Notify student about review
    try {
      const assignment = await AssignmentsModel.findById(submission.assignmentId);
      const assignmentTitle = assignment?.title || 'задание';
      const status = dto.score && dto.score > 0 ? 'оценена' : 'проверена';
      await NotificationsService.notifySubmissionReviewed(
        submission.userId,
        assignmentTitle,
        status,
        id
      );
    } catch (err: any) {
      logger.error('Notification failed after review', { error: err.message });
    }

    return reviewed;
  }

  static async getPendingReviews(): Promise<Submission[]> {
    return SubmissionsModel.findPendingReviews();
  }
}
