import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as employeeController from '../controllers/employee.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('employees.view'), employeeController.getEmployees);
router.get('/:id', requirePermission('employees.view'), employeeController.getEmployeeById);
router.post('/', requirePermission('employees.create'), employeeController.createEmployee);
router.put('/:id', requirePermission('employees.edit'), employeeController.updateEmployee);
router.delete('/:id', requirePermission('employees.edit'), employeeController.deleteEmployee);

export default router;
