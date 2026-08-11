import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import * as libraryController from '../controllers/library.controller.js';

const router = Router();

router.use(authenticate);

// Books
router.get('/books', requirePermission('library.view'), libraryController.getBooks);
router.post('/books', requirePermission('library.manage'), libraryController.createBook);

// Issues
router.get('/issues', requirePermission('library.view'), libraryController.getIssues);
router.post('/issues', requirePermission('library.manage'), libraryController.issueBook);
router.post('/issues/:id/return', requirePermission('library.manage'), libraryController.returnBook);

export default router;
