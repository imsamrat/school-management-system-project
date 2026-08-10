import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/stats', requirePermission('dashboard.view'), getStats);

export default router;
