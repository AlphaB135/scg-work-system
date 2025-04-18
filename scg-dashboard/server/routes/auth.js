// File: server/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// ✅ Login Route - ส่ง token ใน httpOnly cookie
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: 'ไม่พบผู้ใช้งานนี้' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Set token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // ✅ ถ้าขึ้น prod ให้ใช้ true พร้อม https
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });

    res.json({ message: 'เข้าสู่ระบบสำเร็จ', fullName: user.fullName, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
});

// ✅ Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'ออกจากระบบแล้ว' });
});

export default router;
