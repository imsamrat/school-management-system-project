import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as settingsController from '../controllers/settings.controller.js';

const router = Router();

router.use(authenticate);

// School Profile
router.get('/profile', requirePermission('settings.view'), settingsController.getSchoolProfile);
router.put('/profile', requirePermission('settings.manage'), settingsController.updateSchoolProfile);

// System Settings
router.get('/system', requirePermission('settings.view'), settingsController.getSystemSettings);
router.put('/system', requirePermission('settings.manage'), settingsController.updateSystemSettings);

export default router;
