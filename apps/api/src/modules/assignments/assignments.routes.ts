import { Router } from 'express';
import { AssignmentsController } from './assignments.controller';
import { authenticate } from '../auth/auth.middleware';
import { requireAdmin } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/lessons/:lessonId/assignments', AssignmentsController.getAssignmentsByLesson);
router.get('/:id', AssignmentsController.getAssignmentById);
router.post('/', authenticate, requireAdmin, AssignmentsController.createAssignment);
router.patch('/:id', authenticate, requireAdmin, AssignmentsController.updateAssignment);
router.delete('/:id', authenticate, requireAdmin, AssignmentsController.deleteAssignment);

export default router;
