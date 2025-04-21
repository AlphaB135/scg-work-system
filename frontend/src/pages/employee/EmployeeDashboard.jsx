// File: src/pages/employee/EmployeeDashboard.jsx
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUser, resSummary] = await Promise.all([
          fetch('http://localhost:5000/api/auth/me', { credentials: 'include' }),
          fetch('http://localhost:5000/api/my-summary', { credentials: 'include' }),
        ]);

        if (!resUser.ok || !resSummary.ok) throw new Error('Unauthorized');

        const userData = await resUser.json();
        const summaryData = await resSummary.json();

        setUser(userData);
        setSummary(summaryData);
      } catch (err) {
        console.error('❌ Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex">
      <aside className="bg-red-600 text-white w-64 p-6 fixed h-full">
        <div className="mb-6">
          <img src="https://storage.googleapis.com/be8website.appspot.com/logo-scg-white.png" alt="SCG Logo" className="w-20 mb-4" />
          <h1 className="text-xl font-semibold">SCG Employee</h1>
          <p className="text-sm text-white/80">ระบบสำหรับพนักงาน</p>
        </div>
        <nav className="space-y-2">
          <Link to="/employee" className="block text-white py-2 font-bold">ภาพรวม</Link>
          <Link to="/employee/calendar" className="block text-white py-2 hover:opacity-80">ปฏิทิน</Link>
          <Link to="/employee/time-log" className="block text-white py-2 hover:opacity-80">บันทึกเวลา</Link>
          <Link to="/employee/leave-request" className="block text-white py-2 hover:opacity-80">แจ้งขาดงาน</Link>
          <Link to="/employee/documents" className="block text-white py-2 hover:opacity-80">เอกสารของฉัน</Link>
          <LogoutButton className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4" />
        </nav>
      </aside>

      <div className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">ภาพรวมพนักงาน</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow p-4 rounded-xl">
            <p className="text-gray-600 text-sm">วันทำงานในเดือนนี้</p>
            <h3 className="text-2xl font-bold mt-2 text-green-600">
              {summary?.workDays ?? '-'} วัน
            </h3>
            <p className="text-sm text-gray-500 mt-1">รวมถึงวันที่ทำ OT</p>
          </div>
          <div className="bg-white shadow p-4 rounded-xl">
            <p className="text-gray-600 text-sm">วันขาดงาน</p>
            <h3 className="text-2xl font-bold mt-2 text-red-600">
              {summary?.absentDays ?? '-'} วัน
            </h3>
            <p className="text-sm text-gray-500 mt-1">ตรวจสอบในปฏิทินได้</p>
          </div>
          <div className="bg-white shadow p-4 rounded-xl">
            <p className="text-gray-600 text-sm">OT ล่าสุด</p>
            <h3 className="text-2xl font-bold mt-2 text-blue-600">
              {summary?.latestOT?.hours ?? '-'} ชั่วโมง
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {summary?.latestOT?.date ? `วันที่ ${formatDate(summary.latestOT.date)}` : '-'}
            </p>
          </div>
        </div>

        {user && (
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ข้อมูลพนักงาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">ชื่อ</p>
                <p className="font-semibold">{user.fullName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">รหัสพนักงาน</p>
                <p className="font-semibold">{user.employeeCode || `EMP${user.id}`}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">ตำแหน่ง</p>
                <p className="font-semibold">{user.position || 'ไม่ระบุ'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">แผนก</p>
                <p className="font-semibold">{user.department || 'ไม่ระบุ'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">สาขา</p>
                <p className="font-semibold">{user.branch || 'ไม่ระบุ'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">บริษัท</p>
                <p className="font-semibold">{user.company || 'SCG'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">เงินเดือน</p>
                <p className="font-semibold">{user.salary?.toLocaleString() || '-'} บาท</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">SSO</p>
                <p className="font-semibold">{user.sso ? '✅ มี' : '❌ ไม่มี'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">ภาษี</p>
                <p className="font-semibold">{user.tax ? '✅ มี' : '❌ ไม่มี'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">รอบจ่ายเงิน</p>
                <p className="font-semibold">{user.salaryRound || '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">ประเภทพนักงาน</p>
                <p className="font-semibold">{user.employeeType || '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">กลุ่มพนักงาน</p>
                <p className="font-semibold">{user.employeeGroup || '-'}</p>
              </div>
              {/* ✅ เพิ่มส่วนบัญชีธนาคารจาก individualSetting */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">บัญชีธนาคาร</p>
                <p className="font-semibold">{user.individualSetting?.bankAccount || '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">วิธีรับเงิน</p>
                <p className="font-semibold">{user.individualSetting?.paymentMethod || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
