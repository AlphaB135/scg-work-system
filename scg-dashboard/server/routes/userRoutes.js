// File: server/routes/userRoutes.js
import express from 'express';
import prisma from '../utils/prismaClient.js';
import { createUser, getAllUsers, getUserById } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// สมัครผู้ใช้ใหม่
// POST /api/register
router.post('/register', createUser);

// ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
// GET /api/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        position: true,
        department: true,
        company: true,
        branch: true,
        employeeCode: true,
        createdAt: true
      }
    });
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้ที่ล็อกอิน' });
    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching current user:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ดึงพนักงานทั้งหมด (ต้องล็อกอินก่อน)
// GET /api/users
router.get('/users', requireAuth, getAllUsers);

// ดึงพนักงานตาม ID (ต้องล็อกอินก่อน)
// GET /api/users/:id
router.get('/users/:id', requireAuth, getUserById);

export default router;
