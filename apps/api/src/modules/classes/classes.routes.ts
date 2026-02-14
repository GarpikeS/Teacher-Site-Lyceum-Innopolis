import { Router } from 'express';
import { ClassesController } from './classes.controller';
import { authenticate } from '../auth/auth.middleware';
import { requireTeacherOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

/**
 * GET /api/v1/classes
 * Get teacher's classes (or all for admin)
 */
router.get('/', authenticate, requireTeacherOrAdmin, ClassesController.getClasses);

/**
 * GET /api/v1/classes/:id
 * Get class with students
 */
router.get('/:id', authenticate, requireTeacherOrAdmin, ClassesController.getClassById);

/**
 * POST /api/v1/classes
 * Create class
 */
router.post('/', authenticate, requireTeacherOrAdmin, ClassesController.createClass);

/**
 * PATCH /api/v1/classes/:id
 * Update class
 */
router.patch('/:id', authenticate, requireTeacherOrAdmin, ClassesController.updateClass);

/**
 * DELETE /api/v1/classes/:id
 * Delete class
 */
router.delete('/:id', authenticate, requireTeacherOrAdmin, ClassesController.deleteClass);

/**
 * POST /api/v1/classes/:id/students
 * Add student to class
 */
router.post('/:id/students', authenticate, requireTeacherOrAdmin, ClassesController.addStudent);

/**
 * DELETE /api/v1/classes/:id/students/:studentId
 * Remove student from class
 */
router.delete('/:id/students/:studentId', authenticate, requireTeacherOrAdmin, ClassesController.removeStudent);

/**
 * GET /api/v1/classes/:id/statistics
 * Get class statistics
 */
router.get('/:id/statistics', authenticate, requireTeacherOrAdmin, ClassesController.getStatistics);

export default router;
