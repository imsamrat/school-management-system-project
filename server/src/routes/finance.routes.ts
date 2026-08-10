import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as financeController from '../controllers/finance.controller.js';

const router = Router();

router.use(authenticate);

// Fee Structures
router.get('/fee-structures', requirePermission('finance.view'), financeController.getFeeStructures);
router.post('/fee-structures', requirePermission('finance.manage'), financeController.createFeeStructure);

// Invoices
router.get('/invoices', requirePermission('finance.view'), financeController.getInvoices);
router.post('/invoices', requirePermission('finance.manage'), financeController.createInvoice);

// Payments
router.get('/payments', requirePermission('finance.view'), financeController.getPayments);
router.post('/payments/collect', requirePermission('finance.collect'), financeController.collectPayment);

export default router;
