import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as staffController from '../controllers/staff.controller.js';

const router = Router();

router.use(authenticate);

// Full staff list and CRUD
router.get('/', requirePermission('employees.view'), staffController.getStaff);
router.get('/:id', requirePermission('employees.view'), staffController.getStaffById);
router.post('/', requirePermission('employees.create'), staffController.createStaff);
router.put('/:id', requirePermission('employees.edit'), staffController.updateStaff);
router.delete('/:id', requirePermission('employees.edit'), staffController.deleteStaff);

// Special actions
router.patch('/:id/promote', requirePermission('employees.edit'), staffController.promoteToTeacher);
router.patch('/:id/demote', requirePermission('employees.edit'), staffController.demoteFromTeacher);

export default router;
