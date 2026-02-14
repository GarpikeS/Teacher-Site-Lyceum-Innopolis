import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.get('/me', authenticate, ProgressController.getMyProgress);
router.get('/courses/:courseId', authenticate, ProgressController.getCourseProgress);

export default router;
