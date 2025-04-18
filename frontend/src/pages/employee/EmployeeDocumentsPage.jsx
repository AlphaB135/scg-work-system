import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

export default function EmployeeDocumentsPage() {
  const [documents, setDocuments] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/documents', {
        credentials: 'include', // ✅ ใช้ cookie JWT ที่ฝังอยู่ใน browser
      });
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('❌ Error fetching documents:', err);
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, []);
  

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex">
      <aside className="bg-red-600 text-white w-64 p-6 fixed h-full">
        <div className="mb-6">
          <img
            src="https://storage.googleapis.com/be8website.appspot.com/logo-scg-white.png"
            alt="SCG Logo"
            className="w-20 mb-4"
          />
          <h1 className="text-xl font-semibold">SCG Employee</h1>
          <p className="text-sm text-white/80">ระบบสำหรับพนักงาน</p>
        </div>
        <nav className="space-y-2">
          <Link to="/employee" className="block text-white py-2 hover:opacity-80">ภาพรวม</Link>
          <Link to="/employee/calendar" className="block text-white py-2 hover:opacity-80">ปฏิทิน</Link>
          <Link to="/employee/time-log" className="block text-white py-2 hover:opacity-80">บันทึกเวลา</Link>
          <Link to="/employee/leave-request" className="block text-white py-2 hover:opacity-80">แจ้งขาดงาน</Link>
          <Link to="/employee/documents" className="block text-white py-2 hover:opacity-80 font-bold">เอกสารของฉัน</Link>
          <LogoutButton className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4" />
        </nav>
      </aside>

      <div className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">เอกสารของฉัน</h2>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-700 mb-4">สถานะเอกสาร</h3>
          {!documents ? (
            <p className="text-sm text-gray-500">กำลังโหลด...</p>
          ) : (
            <table className="w-full text-sm text-center border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="border p-2">ประเภทเอกสาร</th>
                  <th className="border p-2">สถานะ</th>
                  <th className="border p-2">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border p-2">สำเนาบัตรประชาชน</td>
                  <td className="border p-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${documents.idCard ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {documents.idCard ? 'เรียบร้อย' : 'ยังไม่ส่ง'}
                    </span>
                  </td>
                  <td className="border p-2">{documents.idCardNote || '-'}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border p-2">สำเนาทะเบียนบ้าน</td>
                  <td className="border p-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${documents.houseReg ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {documents.houseReg ? 'เรียบร้อย' : 'ยังไม่ส่ง'}
                    </span>
                  </td>
                  <td className="border p-2">{documents.houseRegNote || '-'}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border p-2">ใบรับรองประกันสังคม</td>
                  <td className="border p-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${documents.socialSecurity ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {documents.socialSecurity ? 'เรียบร้อย' : 'ยังไม่ส่ง'}
                    </span>
                  </td>
                  <td className="border p-2">{documents.socialSecurityNote || '-'}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border p-2">เอกสารภาษี</td>
                  <td className="border p-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${documents.tax ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {documents.tax ? 'เรียบร้อย' : 'ยังไม่ส่ง'}
                    </span>
                  </td>
                  <td className="border p-2">{documents.taxNote || '-'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

