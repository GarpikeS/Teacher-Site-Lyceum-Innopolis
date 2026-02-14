import { AssignmentsModel } from './assignments.model';
import { logger } from '../../utils/logger';
import { Assignment, CreateAssignmentDto, UpdateAssignmentDto } from '@code-platform/shared-types';

export class AssignmentsService {
  static async getAssignmentsByLessonId(lessonId: string, includeUnpublished: boolean = false): Promise<Assignment[]> {
    return await AssignmentsModel.findByLessonId(lessonId, includeUnpublished);
  }

  static async getAssignmentById(id: string): Promise<Assignment> {
    const assignment = await AssignmentsModel.findById(id);
    if (!assignment) throw new Error('Assignment not found');
    return assignment;
  }

  static async createAssignment(dto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = await AssignmentsModel.create(dto);
    logger.info('Assignment created', { assignmentId: assignment.id });
    return assignment;
  }

  static async updateAssignment(id: string, dto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await AssignmentsModel.update(id, dto);
    if (!assignment) throw new Error('Assignment not found');
    logger.info('Assignment updated', { assignmentId: id });
    return assignment;
  }

  static async deleteAssignment(id: string): Promise<void> {
    const deleted = await AssignmentsModel.delete(id);
    if (!deleted) throw new Error('Assignment not found');
    logger.info('Assignment deleted', { assignmentId: id });
  }
}
