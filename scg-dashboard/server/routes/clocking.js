// File: server/routes/clocking.js
import express from 'express';
import prisma from '../utils/prismaClient.js';

const router = express.Router();

router.post('/record-clock', async (req, res) => {
  try {
    const { employeeCode, timestamp, action } = req.body;
    if (!employeeCode || !timestamp || !['IN', 'OUT'].includes(action)) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
    }

    // ✅ หาพนักงานจาก employeeCode
    const user = await prisma.user.findFirst({
      where: { employeeCode: { equals: employeeCode.trim(), mode: 'insensitive' } },
    });
    if (!user) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

    const time = new Date(timestamp);
    const dateOnly = new Date(time.getFullYear(), time.getMonth(), time.getDate());

    // ✅ ตรวจสอบว่า "มาสาย" หรือไม่ (หลัง 09:00)
    const hour = time.getHours();
    const minute = time.getMinutes();
    const isLate = hour > 9 || (hour === 9 && minute > 0);

    // ✅ เช็คว่ามี record ของวันนั้นแล้วหรือยัง
    let record = await prisma.workRecord.findFirst({
      where: {
        userId: user.id,
        date: dateOnly,
      },
    });

    if (!record) {
      // ✅ ยังไม่มี record → สร้างใหม่
      await prisma.workRecord.create({
        data: {
          userId: user.id,
          date: dateOnly,
          clockIn: action === 'IN' ? time : null,
          clockOut: action === 'OUT' ? time : null,
          status: action === 'IN' && isLate ? 'LATE' : 'NORMAL',
        },
      });
    } else {
      // ✅ มี record แล้ว → อัปเดต
      const updateData = {};

      if (action === 'IN' && !record.clockIn) {
        updateData.clockIn = time;
        if (isLate) updateData.status = 'LATE';
      }

      if (action === 'OUT' && !record.clockOut) {
        updateData.clockOut = time;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.workRecord.update({
          where: { id: record.id },
          data: updateData,
        });
      }
    }

    res.json({ message: '✔️ รับข้อมูลบันทึกเวลาเรียบร้อย' });

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
});

export default router;
