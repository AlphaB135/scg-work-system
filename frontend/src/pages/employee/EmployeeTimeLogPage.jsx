import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

export default function EmployeeTimeLogPage() {
  const [timeLogs, setTimeLogs] = useState([]);
  const [status, setStatus] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/timelogs', {
        credentials: 'include', // ✅ ใช้ cookie-based auth
      });
  
      if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');
      const data = await res.json();
      setTimeLogs(data);
    } catch (err) {
      console.error('❌ Error fetching logs:', err);
    }
  };
  
  const handleLog = async (type) => {
    try {
      const res = await fetch('http://localhost:5000/api/timelogs', {
        method: 'POST',
        credentials: 'include', // ✅ ใช้ cookie-based auth
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
  
      if (res.ok) {
        setStatus(`✅ บันทึกเวลา${type === 'in' ? 'เข้า' : 'ออก'}เรียบร้อยแล้ว`);
        fetchLogs();
      } else {
        setStatus('❌ เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (err) {
      console.error('❌ Error logging time:', err);
      setStatus('❌ ไม่สามารถบันทึกเวลาได้');
    }
  };
  
  useEffect(() => {
    fetchLogs();
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
          <Link to="/employee/time-log" className="block text-white py-2 hover:opacity-80 font-bold">บันทึกเวลา</Link>
          <Link to="/employee/leave-request" className="block text-white py-2 hover:opacity-80">แจ้งขาดงาน</Link>
          <Link to="/employee/documents" className="block text-white py-2 hover:opacity-80">เอกสารของฉัน</Link>
          <LogoutButton className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4" />
        </nav>
      </aside>

      <div className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">บันทึกเวลาเข้า-ออกงาน</h2>

        <div className="mb-4 space-x-2">
          <button onClick={() => handleLog('in')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">เข้างาน</button>
          <button onClick={() => handleLog('out')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">เลิกงาน</button>
        </div>

        {status && <div className="mb-4 text-sm text-gray-800">{status}</div>}

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-2 text-gray-800">ประวัติบันทึกเวลา</h3>
          <table className="w-full table-fixed border-collapse text-sm text-center">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="border p-2">วันที่</th>
                <th className="border p-2">เวลา</th>
                <th className="border p-2">ประเภท</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{new Date(log.timestamp).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="border p-2">{log.type === 'in' ? 'เข้างาน' : 'เลิกงาน'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
