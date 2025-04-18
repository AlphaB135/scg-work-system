// File: server/routes/reminderRoutes.js
import express from 'express';
import {
  getReminders,
  createFixedReminder,
  createCustomReminder,
  updateReminder,
  deleteReminder
} from '../controllers/reminderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ดึงทั้งหมด
router.get('/', requireAuth, getReminders);

// เพิ่มแจ้งเตือนแบบฟิก
router.post('/', requireAuth, createFixedReminder);

// เพิ่มแจ้งเตือนแบบกำหนดเอง
router.post('/reminders/custom', requireAuth, createCustomReminder);

// แก้ไขแจ้งเตือนตาม ID
router.put('/:id', requireAuth, updateReminder);

// ลบแจ้งเตือนตาม ID
router.delete('/:id', requireAuth, deleteReminder);

export default router;
