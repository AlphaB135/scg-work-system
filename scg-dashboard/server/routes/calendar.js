// File: server/routes/calendar.js
import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import prisma from '../utils/prismaClient.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ✅ อัปโหลดเข้า workCalendar (เก่า)
router.post('/upload', upload.single('file'), async (req, res) => {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          await prisma.workCalendar.create({
            data: {
              date: new Date(row.date),
              employeeCode: row.employee_code,
              status: row.status,
            }
          });
        }
        fs.unlinkSync(filePath);
        res.json({ message: 'Upload สำเร็จ' });
      } catch (err) {
        console.error('❌ Upload CSV error:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
      }
    });
});

// ✅ อัปโหลดเข้า workRecord พร้อมคำนวณ OT
router.post('/upload-work-records', upload.single('file'), async (req, res) => {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const statusMap = {
          'มาทำงาน': 'PRESENT',
          'ขาดงาน': 'ABSENT',
          'ลางาน': 'LEAVE',
          'วันหยุด': 'HOLIDAY'
        };

        const allowedStatuses = ['PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY'];
        const records = [];

        for (const row of results) {
          const { EmployeeCode, Date: rawDate, DayType, ClockIn, ClockOut, ShiftStart, ShiftEnd } = row;

          const user = await prisma.user.findFirst({
            where: { employeeCode: { equals: EmployeeCode?.trim() } }
          });

          if (!user) continue;

          const rawDayType = DayType?.trim().replace(/\s/g, '');
          const matchedStatus = statusMap[rawDayType];

          if (!allowedStatuses.includes(matchedStatus)) {
            console.warn('❌ ไม่รู้จักสถานะ:', rawDayType);
            continue;
          }

          const dateObj = new Date(rawDate);
          const clockInDate = ClockIn?.trim() ? new Date(`${rawDate}T${ClockIn}:00`) : null;
          const clockOutDate = ClockOut?.trim() ? new Date(`${rawDate}T${ClockOut}:00`) : null;

          let overtime = 0;
          if (clockOutDate && ShiftEnd?.trim()) {
            let shiftEndDate = new Date(`${rawDate}T${ShiftEnd}:00`);

            // ถ้า ShiftEnd < ClockIn → ข้ามคืน → บวก 1 วัน
            if (shiftEndDate < clockInDate) {
              shiftEndDate.setDate(shiftEndDate.getDate() + 1);
            }

            if (clockOutDate > shiftEndDate) {
              const diffMs = clockOutDate - shiftEndDate;
              overtime = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
            }
          }

          records.push({
            userId: user.id,
            date: dateObj,
            status: matchedStatus,
            clockIn: clockInDate,
            clockOut: clockOutDate,
            shiftStart: ShiftStart,
            shiftEnd: ShiftEnd,
            overtime
          });
        }

        if (records.length === 0) {
          return res.status(400).json({ message: 'ไม่พบข้อมูลที่สามารถบันทึกได้' });
        }

        await prisma.workRecord.createMany({ data: records });
        fs.unlinkSync(filePath);

        res.json({ message: `✅ นำเข้าสำเร็จ ${records.length} รายการ` });
      } catch (err) {
        console.error('❌ Import error:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
      }
    });
});

// ✅ ปฏิทินการเข้างานของพนักงาน
router.get('/my-work-calendar', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const month = 3; // เมษายน
    const year = 2025;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const records = await prisma.workRecord.findMany({
      where: { userId, date: { gte: startDate, lt: endDate } },
      orderBy: { date: 'asc' },
    });

    const result = records.map(r => {
      const day = new Date(r.date).getDate();
      let type = 'work';
      let statusText = 'ทำงานปกติ';

      if (r.status === 'ABSENT') {
        type = 'absent';
        statusText = 'ขาดงาน';
      } else if (['LEAVE', 'HOLIDAY'].includes(r.status)) {
        type = 'holiday';
        statusText = 'วันหยุด';
      } else if (r.clockIn) {
        const clockIn = new Date(r.clockIn);
        const lateMins = (clockIn.getHours() * 60 + clockIn.getMinutes()) - (9 * 60);
        if (lateMins > 5) {
          type = 'late';
          statusText = `มาสาย ${lateMins} นาที`;
        }
      }

      return { day, type, checkIn: r.clockIn, checkOut: r.clockOut, statusText };
    });

    res.json(result);
  } catch (err) {
    console.error('❌ Fetch my calendar error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

export default router;
