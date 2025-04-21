//seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

// ✅ ฟังก์ชันแมปสถานะจากภาษาไทยให้ตรง enum
function mapStatus(thaiStatus) {
  switch (thaiStatus?.trim()) {
    case 'วันทำงาน': return 'NORMAL';
    case 'ขาดงาน': return 'ABSENT';
    case 'ลา': return 'LEAVE';
    case 'รออนุมัติ OT': return 'OT_PENDING';
    case 'OT': return 'OT_APPROVED';
    default: return 'NORMAL';
  }
}

async function main() {
  const password = await bcrypt.hash('123456', 10);

  // 🌱 สร้าง admin user
  await prisma.user.upsert({
    where: { username: 'admin01' },
    update: {},
    create: {
      username: 'admin01',
      password,
      fullName: 'Administrator',
      email: 'admin@scg.com',
      role: 'ADMIN',
      position: 'IT Manager',
      department: 'IT',
    },
  });

  console.log('✅ Seeded admin user successfully');

  // 🌱 เพิ่ม seed ข้อมูลพนักงาน 1000 คนจาก mock_employees_1000.json
  const mockEmployees = JSON.parse(fs.readFileSync('./prisma/employees_1000.json', 'utf-8'));

  for (const emp of mockEmployees) {
    const username = emp.code?.trim();
    if (!username) {
      console.warn('⚠️ ไม่มี username:', emp);
      continue;
    }

    const exists = await prisma.user.findUnique({ where: { username } });

    if (!exists) {
      await prisma.user.create({
        data: {
          username,
          password: await bcrypt.hash('123456', 10),
          fullName: emp.fullName,
          email: emp.email,
          phone: emp.phone,
          company: emp.company,
          branch: emp.branch,
          department: emp.department,
          position: emp.position,
          salary: emp.salary,
          role: emp.role || 'EMPLOYEE',
          employeeCode: emp.code,
          employeeType: emp.employeeType,
          employeeGroup: emp.employeeTypeGroup,
          effectiveDate: new Date(emp.effectiveDate),
          beginDate: new Date(emp.beginDate),
          sso: emp.socialSecurity?.status === 'active',
          tax: emp.tax?.status === 'active',
          payrollRound: emp.payroll?.payrollRound,
          salaryRound: emp.payroll?.salaryRound,
          individualSetting: JSON.stringify({
            bankAccount: emp.individualSetting?.bankAccount,
            paymentMethod: emp.individualSetting?.paymentMethod,
            note: emp.individualSetting?.note || '',
          }),
        },
      });
    }
  }

  console.log('✅ Seeded mock employees (1000 คน)');

  // 🌱 เพิ่ม seed แจ้งเตือนแบบฟิก
  await prisma.reminder.createMany({
    data: [
      {
        type: 'FIXED',
        title: 'เตือนส่ง SCB',
        details: 'ปิดงวดทุกวันที่ 20 ต้องส่งไฟล์ให้ SCB',
        dueDate: new Date('2025-04-20'),
        repeat: 'monthly',
        target: 'ALL'
      },
      {
        type: 'FIXED',
        title: 'เตือนยื่น SSO',
        details: 'ยื่น SSO ภายในวันที่ 15',
        dueDate: new Date('2025-04-15'),
        repeat: 'monthly',
        target: 'ALL'
      },
      {
        type: 'FIXED',
        title: 'เตือนยื่นภาษี',
        details: 'ยื่นสรรพากร ภายในวันที่ 15',
        dueDate: new Date('2025-04-15'),
        repeat: 'monthly',
        target: 'ALL'
      },
      {
        type: 'FIXED',
        title: 'ส่งให้ payroll',
        details: 'ส่งแบบฟอร์มให้ payroll ภายในวันที่ 26',
        dueDate: new Date('2025-04-26'),
        repeat: 'monthly',
        target: 'ALL'
      }
    ]
  });

  console.log('✅ Seeded fixed reminders');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
