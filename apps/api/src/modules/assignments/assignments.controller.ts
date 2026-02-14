import { Request, Response } from 'express';
import { AssignmentsService } from './assignments.service';
import { logger } from '../../utils/logger';
import { CreateAssignmentDto, UpdateAssignmentDto } from '@code-platform/shared-types';

export class AssignmentsController {
  static async getAssignmentsByLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const assignments = await AssignmentsService.getAssignmentsByLessonId(lessonId);
      res.json({ success: true, data: assignments });
    } catch (error: any) {
      logger.error('Get assignments error', { error: error.message });
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to get assignments' } });
    }
  }

  static async getAssignmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const assignment = await AssignmentsService.getAssignmentById(id);
      res.json({ success: true, data: assignment });
    } catch (error: any) {
      logger.error('Get assignment error', { error: error.message });
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  }

  static async createAssignment(req: Request, res: Response) {
    try {
      const dto: CreateAssignmentDto = req.body;
      const assignment = await AssignmentsService.createAssignment(dto);
      res.status(201).json({ success: true, data: assignment });
    } catch (error: any) {
      logger.error('Create assignment error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  static async updateAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateAssignmentDto = req.body;
      const assignment = await AssignmentsService.updateAssignment(id, dto);
      res.json({ success: true, data: assignment });
    } catch (error: any) {
      logger.error('Update assignment error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  static async deleteAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await AssignmentsService.deleteAssignment(id);
      res.json({ success: true, message: 'Assignment deleted successfully' });
    } catch (error: any) {
      logger.error('Delete assignment error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } });
    }
  }
}
