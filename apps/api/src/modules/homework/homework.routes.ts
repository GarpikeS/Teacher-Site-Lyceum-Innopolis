import { Router } from 'express';
import { HomeworkController } from './homework.controller';
import { authenticate } from '../auth/auth.middleware';
import { requireTeacherOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

/**
 * GET /api/v1/homework/my
 * Get student's homework (all classes they're enrolled in)
 */
router.get('/my', authenticate, HomeworkController.getMyHomework);

/**
 * GET /api/v1/homework/teacher
 * Get teacher's created homework
 */
router.get('/teacher', authenticate, requireTeacherOrAdmin, HomeworkController.getTeacherHomework);

/**
 * GET /api/v1/homework/:id
 * Get homework details
 */
router.get('/:id', authenticate, HomeworkController.getById);

/**
 * POST /api/v1/homework
 * Create homework (teacher only)
 */
router.post('/', authenticate, requireTeacherOrAdmin, HomeworkController.create);

/**
 * PATCH /api/v1/homework/:id
 * Update homework (teacher only)
 */
router.patch('/:id', authenticate, requireTeacherOrAdmin, HomeworkController.update);

/**
 * DELETE /api/v1/homework/:id
 * Delete homework (teacher only)
 */
router.delete('/:id', authenticate, requireTeacherOrAdmin, HomeworkController.remove);

/**
 * GET /api/v1/homework/:id/submissions
 * Get student submissions for homework (teacher only)
 */
router.get('/:id/submissions', authenticate, requireTeacherOrAdmin, HomeworkController.getSubmissions);

export default router;
