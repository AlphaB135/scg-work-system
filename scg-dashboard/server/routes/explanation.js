import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/authMiddleware.js';
import { updateExplanationStatus, getPendingExplanations } from '../controllers/explanationController.js';

const router = express.Router();
const prisma = new PrismaClient();

// ✅ พนักงานส่งคำชี้แจง
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
        status: 'PENDING',
      },
    });

    res.status(200).json({ message: 'คำชี้แจงถูกส่งแล้ว', data: newExplanation });
  } catch (error) {
    console.error('Error saving explanation:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกคำชี้แจง' });
  }
});

// ✅ หัวหน้ากดอนุมัติ / ปฏิเสธคำชี้แจง
router.patch('/explanation/:id', requireAuth, updateExplanationStatus);

// ✅ ดึงรายการคำชี้แจงที่รออนุมัติ
router.get('/explanation/pending', requireAuth, getPendingExplanations);

export default router;
