import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/submit-explanation', requireAuth, async (req, res) => {
  const { date, explanation } = req.body;
  const userId = req.user?.id;

  if (!date || !explanation) {
    return res.status(400).json({ message: 'กรุณาระบุวันที่และคำชี้แจง' });
  }

  try {
    const newExplanation = await prisma.explanation.create({
      data: {
        date: new Date(date),
        explanation,
        employeeId: userId,
        status: 'PENDING', // เริ่มต้นเป็นรอตรวจสอบ
      },
    });

    res.status(200).json({ message: 'คำชี้แจงถูกส่งแล้ว', data: newExplanation });
  } catch (error) {
    console.error('Error saving explanation:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกคำชี้แจง' });
  }
});

export default router;
