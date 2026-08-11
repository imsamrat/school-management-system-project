import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as staffController from '../controllers/staff.controller.js';

const router = Router();
router.use(authenticate);

// These are legacy aliases — all queries are filtered to teachers only via is_teacher=true
router.get('/', requirePermission('teachers.view'), staffController.getTeachers);
router.get('/:id', requirePermission('teachers.view'), staffController.getTeacherById);
router.post('/', requirePermission('teachers.create'), staffController.createTeacher);
router.put('/:id', requirePermission('teachers.edit'), staffController.updateTeacher);
router.delete('/:id', requirePermission('teachers.edit'), staffController.deleteTeacher);

export default router;
