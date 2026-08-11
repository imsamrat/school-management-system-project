import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as reportsController from '../controllers/reports.controller.js';

const router = Router();

router.use(authenticate);

router.get('/general', requirePermission('reports.view'), reportsController.getGeneralReports);

export default router;
