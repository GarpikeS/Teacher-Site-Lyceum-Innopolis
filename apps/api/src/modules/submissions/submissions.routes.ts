import { Router } from 'express';
import { SubmissionsController } from './submissions.controller';
import { authenticate } from '../auth/auth.middleware';
import { requireTeacherOrAdmin } from '../../middleware/rbac.middleware';

const router = Router();

// Student endpoints
router.post('/assignments/:id/submit', authenticate, SubmissionsController.submitCode);
router.get('/submissions/my', authenticate, SubmissionsController.getMySubmissions);

// Teacher endpoints
router.get('/submissions/pending-reviews', authenticate, requireTeacherOrAdmin, SubmissionsController.getPendingReviews);
router.get('/assignments/:assignmentId/submissions', authenticate, requireTeacherOrAdmin, SubmissionsController.getSubmissionsByAssignment);
router.post('/submissions/:id/review', authenticate, requireTeacherOrAdmin, SubmissionsController.reviewSubmission);

// Must be AFTER /submissions/my and /submissions/pending-reviews
router.get('/submissions/:id', authenticate, SubmissionsController.getSubmission);

export default router;
