import bcrypt from 'bcrypt';
import prisma from '../utils/prismaClient.js';

// สมัครผู้ใช้ใหม่ (Register)
export const createUser = async (req, res) => {
  try {
    const { username, password, fullName, email, employeeCode } = req.body;

    // ตรวจสอบซ้ำ username, email หรือ employeeCode
    const exists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }, { employeeCode }] }
    });
    if (exists) {
      return res.status(409).json({ message: 'Username, email หรือ employeeCode ซ้ำ' });
    }

    // เข้ารหัสรหัสผ่าน
    const hashed = await bcrypt.hash(password, 10);

    // สร้าง User ใหม่
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashed,
        role: 'EMPLOYEE',
        fullName,
        email,
        employeeCode,
        createdAt: new Date()
      }
    });

    // ตอบกลับ
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'ไม่สามารถสร้างผู้ใช้ใหม่ได้' });
  }
};

// ดึงพนักงานทั้งหมด (เฉพาะ EMPLOYEE)
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
      }
    });
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching all users:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
};

// ดึงพนักงานตาม ID
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
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
      }
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
