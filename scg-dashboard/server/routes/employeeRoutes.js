// 📁 routes/employeeRoutes.js
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getMyProfile } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/me', requireAuth, getMyProfile); // GET /api/employees/me

export default router;
