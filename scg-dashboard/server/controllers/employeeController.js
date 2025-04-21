// 📁 controllers/employeeController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
      select: {
        id: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        department: true,
        position: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
