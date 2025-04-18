import express from 'express';
import { getMyWorkRecords, getUnexcusedAbsents } from '../controllers/workRecordController.js';
import { requireAuth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ พนักงานดูประวัติงานตัวเอง
router.get('/work-records', requireAuth, getMyWorkRecords);

// ✅ แอดมินดูรายการขาดงานที่ไม่มีเหตุผล
router.get('/work-records/unexcused', requireAuth, authorize(['ADMIN']), getUnexcusedAbsents);

export default router;
