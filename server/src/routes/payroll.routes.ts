import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as payrollController from '../controllers/payroll.controller.js';

const router = Router();

router.use(authenticate);

// Salary Structures
router.get('/salary-structures', requirePermission('payroll.view'), payrollController.getSalaryStructures);
router.post('/salary-structures', requirePermission('payroll.manage'), payrollController.createSalaryStructure);

// Payroll Records
router.get('/records', requirePermission('payroll.view'), payrollController.getPayrollRecords);
router.post('/process', requirePermission('payroll.process'), payrollController.processPayroll);

export default router;
