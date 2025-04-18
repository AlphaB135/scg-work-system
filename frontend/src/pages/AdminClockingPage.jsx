import React, { useEffect, useState } from 'react';

export default function AdminClockingPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchClockingData();
  }, []);

  const fetchClockingData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clocking-records', {
        credentials: 'include',
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">ข้อมูลการบันทึกเวลาเข้าออกของพนักงาน</h1>
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">รหัสพนักงาน</th>
                <th className="p-2 border">ชื่อ-นามสกุล</th>
                <th className="p-2 border">วันที่</th>
                <th className="p-2 border">สถานะ</th>
                <th className="p-2 border">Clock In</th>
                <th className="p-2 border">Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">{r.user?.employeeCode}</td>
                  <td className="p-2 border">{r.user?.fullName}</td>
                  <td className="p-2 border">{new Date(r.date).toLocaleDateString('th-TH')}</td>
                  <td className="p-2 border">{r.status}</td>
                  <td className="p-2 border text-green-600 font-medium">{r.clockIn ? new Date(r.clockIn).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td className="p-2 border text-red-600 font-medium">{r.clockOut ? new Date(r.clockOut).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">ไม่พบข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
