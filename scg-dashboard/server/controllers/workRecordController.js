// workRecordController.js
import prisma from '../utils/prismaClient.js';

// ✅ พนักงานดูประวัติงานตัวเอง
export const getMyWorkRecords = async (req, res) => {
  try {
    const userId = req.user.userId;

    const records = await prisma.workRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.json(records);
  } catch (error) {
    console.error('❌ Error fetching work records:', error);
    res.status(500).json({ message: 'ไม่สามารถโหลดข้อมูลการทำงานได้' });
  }
};

// ✅ แอดมินดูรายการขาดงานที่ไม่มีเหตุผล
export const getUnexcusedAbsents = async (req, res) => {
  try {
    const records = await prisma.workRecord.findMany({
      where: {
        status: 'ABSENT',
        note: null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
          },
        },
      },
    });

    res.json(records);
  } catch (err) {
    console.error('❌ Error fetching unexcused absents:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
};
