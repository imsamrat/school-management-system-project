import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as documentsController from '../controllers/documents.controller.js';

const router = Router();

router.use(authenticate);

router.get('/certificates', requirePermission('documents.manage'), documentsController.getCertificates);
router.post('/certificates', requirePermission('documents.manage'), documentsController.generateCertificate);

export default router;
