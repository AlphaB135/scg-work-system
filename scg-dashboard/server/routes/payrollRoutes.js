// server/routes/payrollRoutes.js
import express from 'express';
import { requireAuth, authorize } from '../middleware/authMiddleware.js';
import {
    generateDocuments,
    generatePayslip,
    generatePayrollByCode
  } from '../controllers/payrollController.js';
  
const router = express.Router();

// ✅ Generate เอกสาร PDF ภาษี + ประกันสังคม
router.post('/generate-docs', requireAuth, authorize(['ADMIN']), generateDocuments);
router.get('/payroll/by-code', requireAuth, generatePayrollByCode);
// ✅ Generate เพย์สลิป PDF
router.post('/generate-payslip', requireAuth, authorize(['ADMIN']), generatePayslip);
export default router;
