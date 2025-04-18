// File: server/controllers/userController.js
import prisma from '../utils/prismaClient.js';

// ✅ ดึงข้อมูลพนักงานตาม ID
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        company: true,
        branch: true,
        department: true,
        position: true,
        employeeCode: true,
        employeeType: true,
        employeeGroup: true,
        salary: true,
        sso: true,
        tax: true,
        payrollRound: true,
        salaryRound: true,
        individualSetting: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching user by ID:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ✅ ดึงรายการพนักงานทั้งหมด (เฉพาะ EMPLOYEE)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        position: true,
        department: true,
        company: true,
        employeeCode: true,
        sso: true,
        tax: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching all users:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
};
