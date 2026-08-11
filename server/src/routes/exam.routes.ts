import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as examController from '../controllers/exam.controller.js';

const router = Router();

router.use(authenticate);

// Exams
router.get('/', requirePermission('exams.view'), examController.getExams);
router.post('/', requirePermission('exams.create'), examController.createExam);
router.put('/:id', requirePermission('exams.manage'), examController.updateExam);

// Exam Schedules
router.get('/schedules', requirePermission('exams.view'), examController.getExamSchedules);
router.post('/schedules', requirePermission('exams.manage'), examController.createExamSchedule);

// Marks
router.get('/marks', requirePermission('marks.view'), examController.getMarks);
router.get('/student/:id/marks', requirePermission('marks.view'), examController.getStudentMarks);
router.post('/marks', requirePermission('marks.enter'), examController.saveMarks);

export default router;
