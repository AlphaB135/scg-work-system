import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import prisma from '../utils/prismaClient.js';

const router = express.Router();

// ✅ ดึง OT ล่าสุดของ user
router.get('/my-ot', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const latestOT = await prisma.oTRequest.findFirst({
      where: {
        userId,
        approved: true
      },
      orderBy: { date: 'desc' }
    });

    if (!latestOT) {
      return res.status(200).json({ message: 'ยังไม่มีข้อมูล OT ล่าสุด' });
    }

    res.json({
      date: latestOT.date,
      hours: latestOT.hours,
      reason: latestOT.reason,
    });
  } catch (err) {
    console.error('❌ Fetch OT error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

export default router;
