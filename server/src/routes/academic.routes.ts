import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as academicController from '../controllers/academic.controller.js';

const router = Router();

router.use(authenticate);

// We use settings.manage or dashboard.view based on read/write (simplified)
router.get('/classes', requirePermission('dashboard.view'), academicController.getClasses);
router.post('/classes', requirePermission('settings.manage'), academicController.createClass);
router.put('/classes/:id', requirePermission('settings.manage'), academicController.updateClass);

router.get('/sections', requirePermission('dashboard.view'), academicController.getSections);
router.post('/sections', requirePermission('settings.manage'), academicController.createSection);

router.get('/subjects', requirePermission('dashboard.view'), academicController.getSubjects);
router.post('/subjects', requirePermission('settings.manage'), academicController.createSubject);

// Course Assignments & Class Routines
router.get('/course-assignments', requirePermission('dashboard.view'), academicController.getCourseAssignments);
router.post('/course-assignments', requirePermission('settings.manage'), academicController.createCourseAssignment);

router.get('/class-routines', requirePermission('dashboard.view'), academicController.getClassRoutines);
router.post('/class-routines', requirePermission('settings.manage'), academicController.createClassRoutine);

export default router;
