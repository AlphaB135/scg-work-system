import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

export default function EmployeeLeavePage() {
  const [form, setForm] = useState({ reason: '', date: '' });
  const [leaveList, setLeaveList] = useState([]);
  const [status, setStatus] = useState('');

  const fetchLeaveHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leaves', {
        credentials: 'include', // ✅ ใช้ cookie แทน token
      });
      const data = await res.json();
      setLeaveList(data);
    } catch (err) {
      console.error('❌ Error fetching leave history:', err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/api/leaves', {
        method: 'POST',
        credentials: 'include', // ✅ ใช้ cookie แทน token
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
  
      if (res.ok) {
        setStatus('✅ ส่งคำร้องขอขาดงานเรียบร้อย');
        setForm({ reason: '', date: '' });
        fetchLeaveHistory(); // โหลดข้อมูลใหม่
      } else {
        setStatus('❌ ส่งคำร้องไม่สำเร็จ');
      }
    } catch (err) {
      console.error('❌ Error submitting leave request:', err);
      setStatus('❌ เกิดข้อผิดพลาด');
    }
  };
  
  useEffect(() => {
    fetchLeaveHistory();
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
          <Link to="/employee/leave-request" className="block text-white py-2 hover:opacity-80 font-bold">แจ้งขาดงาน</Link>
          <Link to="/employee/documents" className="block text-white py-2 hover:opacity-80">เอกสารของฉัน</Link>
          <LogoutButton className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4" />
        </nav>
      </aside>

      <div className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">แจ้งเหตุขาดงาน</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-4 mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-800">ส่งคำร้องขาดงาน</h3>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700">วันที่</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700">เหตุผล</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border p-2 rounded"
              rows="3"
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            ส่งคำร้อง
          </button>
          {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
        </form>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-2 text-gray-800">ประวัติการแจ้งขาดงาน</h3>
          <table className="w-full table-fixed border-collapse text-sm text-center">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="border p-2">วันที่</th>
                <th className="border p-2">เหตุผล</th>
              </tr>
            </thead>
            <tbody>
              {leaveList.map((leave, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{new Date(leave.date).toLocaleDateString()}</td>
                  <td className="border p-2 text-left">{leave.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
