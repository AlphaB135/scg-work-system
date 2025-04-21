// 📁 server/scripts/clear-work-records.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.workRecord.deleteMany({});
  console.log('🧹 ลบ Work Records เรียบร้อย');
  await prisma.$disconnect();
}

run();
