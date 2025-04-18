import express from 'express';
import { requireAuth, authorize } from '../middleware/authMiddleware.js';
import { generateDocuments } from '../controllers/documentController.js';

const router = express.Router();

// ✅ Admin generate tax + sso documents
router.post('/documents/generate', requireAuth, authorize(['ADMIN']), generateDocuments);

export default router;
