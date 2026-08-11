import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as staffController from '../controllers/staff.controller.js';

const router = Router();
router.use(authenticate);

// Legacy aliases — filtered to non-teachers (is_teacher=false)
router.get('/', requirePermission('employees.view'), staffController.getEmployees);
router.get('/:id', requirePermission('employees.view'), staffController.getEmployeeById);
router.post('/', requirePermission('employees.create'), staffController.createEmployee);
router.put('/:id', requirePermission('employees.edit'), staffController.updateEmployee);
router.delete('/:id', requirePermission('employees.edit'), staffController.deleteEmployee);

export default router;
