import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as searchController from '../controllers/search.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', searchController.globalSearch);

export default router;
