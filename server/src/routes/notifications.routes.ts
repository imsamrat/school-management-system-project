import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as notificationsController from '../controllers/notifications.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.put('/:id/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);

export default router;
