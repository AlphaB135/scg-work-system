// 📁 server/utils/payrollUtils.js

const WORKING_DAYS_PER_MONTH = 25;
const DAILY_DEDUCTION = (salary) => salary / WORKING_DAYS_PER_MONTH;

/**
 * หักเงินตามประเภท (สาย/ขาด) โดยใช้เวลาจาก checkIn
 */
export function calculateDeductions(workRecords, salary) {
  const deductions = [];

  workRecords.forEach(record => {
    const { date, type, checkIn } = record;

    if (type === 'absent') {
      deductions.push({
        date,
        reason: 'ขาดงาน',
        amount: DAILY_DEDUCTION(salary),
      });
    }

    if (type === 'late') {
      if (!checkIn || checkIn === '-') return;

      const [h, m] = checkIn.split(':').map(Number);
      const totalLateMinutes = (h - 8) * 60 + (m - 30);
      let amount = 0;

      if (totalLateMinutes >= 15 && totalLateMinutes < 30) amount = 50;
      else if (totalLateMinutes >= 30 && totalLateMinutes <= 60) amount = 100;
      else if (totalLateMinutes > 60) amount = 200;

      deductions.push({
        date,
        reason: `มาสาย ${totalLateMinutes} นาที`,
        amount,
      });
    }
  });

  return deductions;
}

/**
 * คำนวณ OT จาก record ที่สถานะอนุมัติ
 */
export function calculateOTFromClockOut(workRecords) {
  let totalHours = 0;

  workRecords.forEach(record => {
    if (!record.clockOut || !record.shiftEnd) return;

    // เปลี่ยน shiftEnd ("HH:mm") เป็นนาทีของวัน
    const [endH, endM] = record.shiftEnd.split(':').map(Number);
    const shiftEndMins = endH * 60 + endM;

    const out = new Date(record.clockOut);
    let outMins = out.getHours() * 60 + out.getMinutes();

    // ถ้า clockOut อยู่ก่อน shiftEnd แปลว่าสิ้นสุดหลังเที่ยงคืน
    if (outMins < shiftEndMins) {
      outMins += 24 * 60;
    }

    const diff = outMins - shiftEndMins;
    if (diff > 0) {
      totalHours += diff / 60;
    }
  });

  return totalHours;
}

export function calculateOTFromShift(workRecords) {
  let totalHours = 0;

  for (const record of workRecords) {
    if (!record.shiftEnd || !record.clockOut) continue;

    // แปลง shiftEnd ("17:00") เป็น Date object ของวันนั้น
    const [endHour, endMin] = record.shiftEnd.split(':').map(Number);
    const shiftEndDate = new Date(record.date);
    shiftEndDate.setHours(endHour, endMin, 0, 0);

    const otMs = new Date(record.clockOut) - shiftEndDate;

    if (otMs > 0) {
      totalHours += otMs / (1000 * 60 * 60); // แปลงเป็นชั่วโมง
    }
  }

  return totalHours;
}
