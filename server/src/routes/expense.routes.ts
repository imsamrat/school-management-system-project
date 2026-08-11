import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as expenseController from '../controllers/expense.controller.js';

const router = Router();

router.use(authenticate);

router.get('/categories', requirePermission('fees.view'), expenseController.getExpenseCategories);
router.post('/categories', requirePermission('fees.collect'), expenseController.createExpenseCategory);
router.delete('/categories/:id', requirePermission('fees.collect'), expenseController.deleteExpenseCategory);

router.get('/', requirePermission('fees.view'), expenseController.getExpenses);
router.post('/', requirePermission('fees.collect'), expenseController.createExpense);
router.delete('/:id', requirePermission('fees.refund'), expenseController.deleteExpense);

export default router;
