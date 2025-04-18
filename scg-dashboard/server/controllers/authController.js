import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prismaClient.js';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// 🔐 Login
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { employeeCode: username }]
      }
    });

    if (!user) return res.status(401).json({ message: 'ไม่พบผู้ใช้' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

    // ✅ สำคัญ: ใส่ id ลง token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // <== เปลี่ยนเป็น id
      JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ fullName: user.fullName, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error });
  }
};

// 🔓 Logout
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'ออกจากระบบสำเร็จ' });
};

// 📩 Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'ไม่พบบัญชีที่มีอีเมลนี้' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30m' });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SCG HR System" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'ลิงก์รีเซ็ตรหัสผ่าน',
      html: `<p>คุณสามารถเปลี่ยนรหัสผ่านได้โดยคลิกลิงก์นี้: <a href="${resetLink}">รีเซ็ตรหัสผ่าน</a></p>`,
    });

    res.json({ message: 'ส่งลิงก์เปลี่ยนรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ' });
  } catch (error) {
    console.error('❌ Error in forgotPassword:', error);
    res.status(500).json({ message: 'ไม่สามารถส่งอีเมลได้' });
  }
};

// 🔁 Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: decoded.id }, // <== ใช้ id ที่มาจาก token
      data: { password: hashedPassword },
    });

    res.json({ message: 'ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว' });
  } catch (error) {
    console.error('❌ Error in resetPassword:', error);
    res.status(400).json({ message: 'ลิงก์ไม่ถูกต้องหรือหมดอายุ' });
  }
};
