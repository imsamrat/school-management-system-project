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

// Guardian routes
router.get('/:id/guardians', requirePermission('students.view'), studentController.getStudentGuardians);
router.post('/:id/guardians', requirePermission('students.edit'), studentController.addStudentGuardian);
router.delete('/guardians/:guardianId', requirePermission('students.edit'), studentController.deleteStudentGuardian);

export default router;
