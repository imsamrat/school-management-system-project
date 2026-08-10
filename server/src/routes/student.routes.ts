import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as studentController from '../controllers/student.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('students.view'), studentController.getStudents);
router.get('/:id', requirePermission('students.view'), studentController.getStudentById);
router.post('/', requirePermission('students.create'), studentController.createStudent);
router.put('/:id', requirePermission('students.edit'), studentController.updateStudent);
router.delete('/:id', requirePermission('students.delete'), studentController.deleteStudent);

export default router;
