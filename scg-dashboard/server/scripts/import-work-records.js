// server/scripts/import-work-records.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FILE_PATH = path.join('data', 'employee_work.csv');

async function run() {
  const records = [];
  const stream = fs.createReadStream(FILE_PATH).pipe(csv());

  for await (const row of stream) {
    const {
      EmployeeCode,
      Date: dateStr,
      DayType,
    ShiftStart,   // สมมติชื่อคอลัมน์ใน CSV คือ ShiftStart
    ShiftEnd      // สมมติชื่อคอลัมน์ใน CSV คือ ShiftEnd
    } = row;

    if (!EmployeeCode || !dateStr || !DayType) continue;

    const user = await prisma.user.findFirst({
      where: {
        employeeCode: {
          equals: EmployeeCode.trim(),
          mode: 'insensitive',
        }
      }
    });

    if (!user) {
      console.warn(`ไม่พบพนักงาน ${EmployeeCode}`);
      continue;
    }

    const isWorkDay = DayType.includes('มาทำงาน');
    const [dd, mm, yyyy] = dateStr.split('/');
    const isoDate = new Date(`${yyyy}-${mm}-${dd}`);

    records.push({
      userId:      user.id,
      date:        isoDate,
      status:      isWorkDay ? 'PRESENT' : 'ABSENT',
     shiftStart:  ShiftStart?.trim() || null,  // e.g. "17:00"
     shiftEnd:    ShiftEnd?.trim()   || null   // e.g. "01:00"
    });
  }

  console.log(`✅ เตรียมบันทึก ${records.length} เรคคอร์ด`);

 await prisma.workRecord.createMany({
  data: records,
   skipDuplicates: true   // ถ้าอยากข้ามพวกซ้ำซ้อน
 });
  console.log(`🎉 บันทึกสำเร็จ`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
