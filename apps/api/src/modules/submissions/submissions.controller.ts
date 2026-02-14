import { Request, Response } from 'express';
import { SubmissionsService } from './submissions.service';
import { logger } from '../../utils/logger';
import { CreateSubmissionDto, ReviewSubmissionDto } from '@code-platform/shared-types';

export class SubmissionsController {
  static async submitCode(req: Request, res: Response) {
    try {
      const dto: CreateSubmissionDto = {
        assignmentId: req.params.id,
        code: req.body.code,
        language: req.body.language,
      };
      const userId = (req as any).user.id;
      const submission = await SubmissionsService.createSubmission(dto, userId);
      res.status(201).json({ success: true, data: submission });
    } catch (error: any) {
      logger.error('Submit code error', { error: error.message });
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: { code: error.code || 'SUBMIT_ERROR', message: error.message },
      });
    }
  }

  static async getSubmission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const submission = await SubmissionsService.getSubmissionById(id);
      res.json({ success: true, data: submission });
    } catch (error: any) {
      logger.error('Get submission error', { error: error.message });
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  static async getMySubmissions(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const submissions = await SubmissionsService.getMySubmissions(userId);
      res.json({ success: true, data: submissions });
    } catch (error: any) {
      logger.error('Get my submissions error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get submissions' },
      });
    }
  }

  static async getSubmissionsByAssignment(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;
      const submissions = await SubmissionsService.getSubmissionsByAssignment(assignmentId);
      res.json({ success: true, data: submissions });
    } catch (error: any) {
      logger.error('Get submissions by assignment error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get submissions' },
      });
    }
  }

  static async reviewSubmission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reviewerId = (req as any).user.id;
      const dto: ReviewSubmissionDto = req.body;
      const submission = await SubmissionsService.reviewSubmission(id, reviewerId, dto);
      res.json({ success: true, data: submission });
    } catch (error: any) {
      logger.error('Review submission error', { error: error.message });
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: { code: error.code || 'REVIEW_ERROR', message: error.message },
      });
    }
  }

  static async getPendingReviews(req: Request, res: Response) {
    try {
      const submissions = await SubmissionsService.getPendingReviews();
      res.json({ success: true, data: submissions });
    } catch (error: any) {
      logger.error('Get pending reviews error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get pending reviews' },
      });
    }
  }
}
