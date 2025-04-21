// 📁 server/controllers/payrollController.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { generateEmployeeDocument } from '../utils/documentGenerator.js';
import { generatePayslipPDF } from '../utils/payslipGenerator.js';
import { calculateDeductions, calculateOTFromShift } from '../utils/payrollUtils.js';

// สร้างเอกสาร PDF ภาษีหรือประกันสังคม
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

// สร้างเพย์สลิป PDF ให้พนักงานตามช่วงเวลา
export const generatePayslip = async (req, res) => {
  const { employeeCode, startDate, endDate } = req.body;

  if (!employeeCode || !startDate || !endDate) {
    return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน' });
  }

  try {
    const employee = await prisma.user.findUnique({ where: { employeeCode } });
    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

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

// คำนวณ Payroll + OT
export const generatePayrollByCode = async (req, res) => {
  try {
    const { code, month, year } = req.query;
    if (!code || !month || !year) {
      return res.status(400).json({ message: 'กรุณาระบุ code, month และ year ให้ครบถ้วน' });
    }

    const employee = await prisma.user.findUnique({ where: { employeeCode: code } });
    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

    const paddedMonth = String(month).padStart(2, '0');
    const startDate = new Date(`${year}-${paddedMonth}-01T00:00:00`);
    const endDate = new Date(`${year}-${paddedMonth}-31T23:59:59`);

    const allRecords = await prisma.workRecord.findMany({
      where: {
        userId: employee.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const workRecords = allRecords.filter(r =>
      ['PRESENT', 'LEAVE', 'ABSENT', 'OT_APPROVED'].includes(r.status)
    );

    const deductions = calculateDeductions(workRecords, employee.salary);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

    const totalOTHours = calculateOTFromShift(workRecords);
    const otRate = employee.salary / 160;
    const otAmount = totalOTHours * otRate;

    console.log('📌 allRecords:', allRecords);
    console.log('📌 workRecords:', workRecords);

    res.json({
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      baseSalary: employee.salary,
      otHours: totalOTHours,
      otAmount,
      netSalary: employee.salary - totalDeductions + otAmount,
      deductions,
      month,
      year,
    });
  } catch (err) {
    console.error('❌ generatePayrollByCode error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};
