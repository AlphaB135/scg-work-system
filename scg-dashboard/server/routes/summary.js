// File: server/routes/summary.js
import express from 'express';
import prisma from '../utils/prismaClient.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-summary', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [records, latestOTRequest] = await Promise.all([
      prisma.workRecord.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      }),
      prisma.oTRequest.findFirst({
        where: { userId, approved: true },
        orderBy: { date: 'desc' },
      }),
    ]);

    // ✅ วันทำงาน
    const workDays = records.filter(r =>
      ['PRESENT', 'OT_APPROVED'].includes(r.status)
    ).length;

    // ❌ ขาดงาน
    const absentDays = records.filter(r =>
      r.status === 'ABSENT'
    ).length;

    // 🔁 OT ล่าสุด (จาก workRecord)
    const latestWithOT = records.find(r => r.overtime && r.overtime > 0);

    const latestOT = latestWithOT
      ? {
          date: latestWithOT.date,
          hours: latestWithOT.overtime
        }
      : latestOTRequest
        ? {
            date: latestOTRequest.date,
            hours: latestOTRequest.hours
          }
        : null;

    res.json({
      workDays,
      absentDays,
      latestOT
    });
  } catch (err) {
    console.error('❌ Summary error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

export default router;
