import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as admissionsController from '../controllers/admissions.controller.js';

const router = Router();

router.use(authenticate);

router.get('/applications', requirePermission('admissions.view'), admissionsController.getApplications);
router.post('/applications', requirePermission('admissions.manage'), admissionsController.createApplication);
router.put('/applications/:id/status', requirePermission('admissions.manage'), admissionsController.updateApplicationStatus);

export default router;
