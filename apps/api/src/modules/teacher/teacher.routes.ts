import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import { authenticate } from '../auth/auth.middleware';
import { requireTeacherOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/dashboard', authenticate, requireTeacherOrAdmin, TeacherController.getDashboard);

export default router;
