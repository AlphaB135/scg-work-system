// File: server/index.js
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// ✅ Routes
import clockingRoutes from './routes/clocking.js';
import workRecordRoutes from './routes/workRecordRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import calendarRoutes from './routes/calendar.js';

import { startReminderCron } from './jobs/reminderCron.js';

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'ขออภัย คุณส่งคำขอบ่อยเกินไป กรุณารอสักครู่',
});
app.use(limiter);

// ✅ Routes
app.use('/api', calendarRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', workRecordRoutes);
app.use('/api', reminderRoutes);
app.use('/api/reminders', reminderRoutes); // สำรอง
app.use('/api', payrollRoutes);
app.use('/api', clockingRoutes); // ✅ สำหรับแปะบัตร real-time

// ✅ Cron
startReminderCron();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
