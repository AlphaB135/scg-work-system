// server/controllers/payrollController.js
import prisma from '../utils/prismaClient.js';
import { generateEmployeeDocument } from '../utils/documentGenerator.js';
import { generatePayslipPDF } from '../utils/payslipGenerator.js';

// ✅ สร้างเอกสาร PDF ภาษีหรือประกันสังคม (mock หลายคนได้ในรอบเดียว)
export const generateDocuments = async (req, res) => {
  const { type, employeeCodes } = req.body;

  if (!type || !['TAX', 'SSO'].includes(type) || !Array.isArray(employeeCodes)) {
    return res.status(400).json({ message: 'กรุณาระบุ type และรายชื่อรหัสพนักงานให้ถูกต้อง' });
  }

  try {
    const generatedFiles = [];

    for (const code of employeeCodes) {
      const employee = await prisma.user.findUnique({ where: { employeeCode: code } });
      if (employee) {
        const filepath = generateEmployeeDocument(employee, type);
        generatedFiles.push({ employeeCode: code, file: filepath });
      }
    }

    res.json({ message: 'สร้างเอกสารเรียบร้อยแล้ว', files: generatedFiles });
  } catch (err) {
    console.error('❌ Error generating docs:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างเอกสาร', error: err.message });
  }
};

// ✅ สร้างเพย์สลิป PDF ให้พนักงานตามช่วงเวลา
export const generatePayslip = async (req, res) => {
  const { employeeCode, startDate, endDate } = req.body;

  if (!employeeCode || !startDate || !endDate) {
    return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน' });
  }

  try {
    const employee = await prisma.user.findUnique({ where: { employeeCode } });

    if (!employee) {
      return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    }

    const workLogs = await prisma.workRecord.findMany({
      where: {
        userId: employee.id,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { date: 'asc' },
    });

    const filepath = generatePayslipPDF(employee, workLogs);
    res.json({ message: 'สร้างเพย์สลิปสำเร็จ', file: filepath });
  } catch (err) {
    console.error('❌ Error generating payslip:', err);
    res.status(500).json({ message: 'ไม่สามารถสร้างเพย์สลิปได้', error: err.message });
  }
};
