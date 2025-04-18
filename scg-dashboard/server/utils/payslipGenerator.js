// payslipGenerator.js
import PDFDocument from 'pdfkit';
import { writeFileSync } from 'fs';
import { join } from 'path';

export function generatePayslipPDF(employee, workLogs) {
  const doc = new PDFDocument();
  const filename = `${employee.employeeCode}_payslip.pdf`;
  const filepath = join('generated_docs', filename);
  const stream = doc.pipe(writeFileSync(filepath));

  doc.fontSize(16).text('เพย์สลิป', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`ชื่อ: ${employee.fullName}`);
  doc.text(`ตำแหน่ง: ${employee.position}`);
  doc.text(`ช่วงเวลา: ${workLogs[0]?.date} - ${workLogs.at(-1)?.date}`);
  doc.moveDown();

  const workDays = workLogs.filter(log => log.status === 'PRESENT').length;
  const salaryPerDay = employee.salary / 30;
  const total = Math.round(salaryPerDay * workDays);

  doc.text(`จำนวนวันทำงาน: ${workDays} วัน`);
  doc.text(`รวมเงินเดือน: ${total.toLocaleString()} บาท`);

  doc.end();
  return filepath;
}
