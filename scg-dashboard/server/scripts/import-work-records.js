// server/scripts/import-work-records.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FILE_PATH = path.join('data', 'employee_work.csv'); // วางไฟล์ไว้ที่นี่

async function run() {
  const records = [];

  const stream = fs.createReadStream(FILE_PATH).pipe(csv());

  for await (const row of stream) {
 /*    console.log(row);  */
    const { EmployeeCode, Date: dateStr, DayType } = row;

    if (!EmployeeCode || !dateStr || !DayType) continue;

    const user = await prisma.user.findFirst({
        where: {
          employeeCode: {
            equals: EmployeeCode.trim(),
            mode: 'insensitive', // ✅ ไม่ต้องตรงเป๊ะ a == A ได้
          }
        }
      });      

    if (!user) {
      console.warn(`ไม่พบพนักงาน ${EmployeeCode}`);
      continue;
    }

    const isWorkDay = DayType.includes('มาทำงาน');
    const dateParts = dateStr.split('/');
    const isoDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

    records.push({
      userId: user.id,
      date: isoDate,
      status: isWorkDay ? 'PRESENT' : 'ABSENT',
    });
  }

  console.log(`✅ เตรียมบันทึก ${records.length} เรคคอร์ด`);
  await prisma.workRecord.createMany({ data: records });
  console.log(`🎉 บันทึกสำเร็จ`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
