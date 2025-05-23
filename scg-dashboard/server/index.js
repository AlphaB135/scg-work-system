// ✅ server/index.js
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
import employeeRoutes from './routes/employeeRoutes.js';
import { startReminderCron } from './jobs/reminderCron.js';
import explanationRoutes from './routes/explanation.js';
import summaryRoutes from './routes/summary.js';
import otRoutes from './routes/otRoutes.js';

// ✅ Middleware
import attachUser from './middleware/attachUser.js';

dotenv.config();
const app = express();

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

// ✅ Login routes (ไม่ใช้ attachUser)
app.use('/api/auth', authRoutes);

// ✅ แนบ req.user หลัง login สำหรับ routes อื่นๆ
app.use('/api', attachUser);

// ✅ Routes
app.use('/api', summaryRoutes);
app.use('/api', otRoutes);
app.use('/api', calendarRoutes);
app.use('/api', userRoutes);
app.use('/api', workRecordRoutes);
app.use('/api', reminderRoutes);
app.use('/api/reminders', reminderRoutes); // สำรอง
app.use('/api', clockingRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api', explanationRoutes);
app.use('/api', payrollRoutes);
app.use('/api/payroll', payrollRoutes);


// ✅ Cron
startReminderCron();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
