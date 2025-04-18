import cron from 'node-cron';
import prisma from '../utils/prismaClient.js';
import { subDays, isSameDay } from 'date-fns';

const checkReminders = async (timeSlot) => {
  const today = new Date();

  const reminders = await prisma.reminder.findMany({
    where: {
      notifyBeforeDays: { not: null },
      isDone: false,
    },
  });

  for (const r of reminders) {
    const notifyDate = subDays(new Date(r.dueDate), r.notifyBeforeDays);

    if (!isSameDay(notifyDate, today)) continue;

    // ตรวจสอบว่าแจ้งรอบนี้ไปแล้วหรือยัง
    const field = getNotifyField(timeSlot);
    if (!r[field]) {
      console.log(`🔔 แจ้งเตือนช่วง ${timeSlot}: ${r.title} | ถึงกำหนด: ${new Date(r.dueDate).toLocaleDateString()}`);

      // 👉 เพิ่ม logic จริง เช่น ส่ง email / push notification

      // อัปเดตว่ารอบนี้แจ้งแล้ว
      await prisma.reminder.update({
        where: { id: r.id },
        data: { [field]: true },
      });
    }
  }
};

const getNotifyField = (slot) => {
  return {
    morning: 'notifiedMorning',
    afternoon: 'notifiedAfternoon',
    evening: 'notifiedEvening',
  }[slot];
};

// สร้าง task สำหรับทุกช่วงเวลา
export const startReminderCron = () => {
  cron.schedule('0 9 * * *', () => checkReminders('morning'));   // 9 โมง
  cron.schedule('0 13 * * *', () => checkReminders('afternoon')); // บ่ายโมง
  cron.schedule('0 17 * * *', () => checkReminders('evening'));   // 5 โมง
};
