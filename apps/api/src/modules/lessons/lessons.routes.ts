import { Router } from 'express';
import { LessonsController } from './lessons.controller';
import { authenticate, optionalAuthenticate } from '../auth/auth.middleware';
import { requireAdmin } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/courses/:courseId/lessons', optionalAuthenticate, LessonsController.getLessonsByCourse);
router.get('/:id', LessonsController.getLessonById);
router.post('/', authenticate, requireAdmin, LessonsController.createLesson);
router.patch('/:id', authenticate, requireAdmin, LessonsController.updateLesson);
router.delete('/:id', authenticate, requireAdmin, LessonsController.deleteLesson);
router.post('/:id/start', authenticate, LessonsController.startLesson);
router.post('/:id/complete', authenticate, LessonsController.completeLesson);

export default router;
