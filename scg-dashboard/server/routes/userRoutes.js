import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import prisma from '../utils/prismaClient.js';

const router = express.Router();

// ✅ ดึงรายชื่อพนักงานทั้งหมด (เฉพาะ ADMIN)
router.get('/users', requireAuth, getAllUsers);

// ✅ ดึงข้อมูลพนักงานรายคนตาม ID
router.get('/users/:id', requireAuth, getUserById);

// ✅ ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่ (ใช้สำหรับแสดงผลหน้า dashboard)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        email: true,
        position: true,
        department: true,
        employeeCode: true,
        branch: true,
        company: true,
        salary: true,
        sso: true,
        tax: true,
        salaryRound: true,
        employeeType: true,
        employeeGroup: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error('❌ Error in /me route:', err);
    res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ', error: err.message });
  }
});

// ✅ ดึงสรุปข้อมูลพนักงาน (เฉพาะคนล็อกอิน)
router.get('/my-summary', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const year = 2025;
    const month = 3; // เม.ย. = index 3
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const records = await prisma.workRecord.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
    });

    const workDays = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
    const absentDays = records.filter(r => r.status === 'ABSENT').length;

    const latestOT = records
      .filter(r => r.otHours && r.otHours > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    res.json({
      workDays,
      absentDays,
      latestOT: latestOT ? { hours: latestOT.otHours, date: latestOT.date } : null,
    });
  } catch (err) {
    console.error('❌ Error in /my-summary route:', err);
    res.status(500).json({ message: 'ดึงข้อมูลสรุปไม่สำเร็จ', error: err.message });
  }
});

export default router;
