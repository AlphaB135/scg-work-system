// server/scripts/clear-work-records.js
import prisma from '../utils/prismaClient.js';

async function clear() {
  try {
    const result = await prisma.workRecord.deleteMany({});
    console.log(`🧹 ลบ workRecord สำเร็จแล้ว: ${result.count} แถว`);
  } catch (err) {
    console.error('❌ ลบข้อมูลล้มเหลว:', err);
  } finally {
    await prisma.$disconnect();
  }
}

clear();
