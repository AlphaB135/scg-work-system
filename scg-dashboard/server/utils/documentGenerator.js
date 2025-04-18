// server/utils/documentGenerator.js
import { writeFileSync } from 'fs';
import { join } from 'path';
import PDFDocument from 'pdfkit';

/**
 * สร้าง PDF สำหรับฟอร์มภาษี (ใบ 50ทวิ) และฟอร์มประกันสังคม
 * @param {Object} employee - ข้อมูลพนักงาน
 * @param {String} type - 'TAX' | 'SSO'
 * @returns {String} path - ตำแหน่งไฟล์ PDF ที่สร้าง
 */
export function generateEmployeeDocument(employee, type = 'TAX') {
  const doc = new PDFDocument();
  const filename = `${employee.employeeCode}_${type}.pdf`;
  const filepath = join('generated_docs', filename);
  const stream = doc.pipe(writeFileSync(filepath));

  doc.fontSize(18).text(type === 'TAX' ? 'ใบรับรองการหักภาษี ณ ที่จ่าย (50ทวิ)' : 'แบบยื่นข้อมูลประกันสังคม', {
    align: 'center',
  });

  doc.moveDown();
  doc.fontSize(12).text(`ชื่อพนักงาน: ${employee.fullName}`);
  doc.text(`รหัสพนักงาน: ${employee.employeeCode}`);
  doc.text(`ตำแหน่ง: ${employee.position}`);
  doc.text(`แผนก: ${employee.department}`);
  doc.text(`เงินเดือน: ${employee.salary.toLocaleString()} บาท`);

  if (type === 'TAX') {
    doc.moveDown();
    doc.text(`ภาษีที่หัก (ประมาณ): ${(employee.salary * 0.05).toLocaleString()} บาท`); // สมมติหัก 5%
  }

  if (type === 'SSO') {
    doc.moveDown();
    doc.text(`ประกันสังคม: ${employee.sso ? 'ส่งแล้ว' : 'ยังไม่ส่ง'}`);
  }

  doc.end();
  return filepath;
}
