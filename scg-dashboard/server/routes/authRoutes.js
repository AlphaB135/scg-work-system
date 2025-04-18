import express from 'express';
import {
  login,
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// ✅ Login: สร้าง token แล้วส่งกลับเป็น cookie
router.post('/login', login);

// ✅ Logout: ล้าง cookie ออก
router.post('/logout', logout);

// ✅ Forgot password: ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมล
router.post('/forgot-password', forgotPassword);

// ✅ Reset password: รีเซ็ตรหัสผ่านใหม่โดยใช้ token
router.post('/reset-password/:token', resetPassword);

export default router;
