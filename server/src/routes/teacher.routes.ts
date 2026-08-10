import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as teacherController from '../controllers/teacher.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('teachers.view'), teacherController.getTeachers);
router.get('/:id', requirePermission('teachers.view'), teacherController.getTeacherById);
router.post('/', requirePermission('teachers.create'), teacherController.createTeacher);
router.put('/:id', requirePermission('teachers.edit'), teacherController.updateTeacher);
router.delete('/:id', requirePermission('teachers.edit'), teacherController.deleteTeacher); // Assuming edit allows delete for now

export default router;
