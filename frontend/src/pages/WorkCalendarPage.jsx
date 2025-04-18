import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function EmployeeCalendarPage() {
  const [calendarData, setCalendarData] = useState([]);
  const [shiftSchedule, setShiftSchedule] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await fetch('http://localhost:5000/api/my-work-calendar', {
        credentials: 'include',
      });
      const data1 = await res1.json();
      setCalendarData(data1);

      const res2 = await fetch('http://localhost:5000/api/shifts', {
        credentials: 'include',
      });
      const data2 = await res2.json();
      setShiftSchedule(data2);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex">
      {/* Sidebar */}
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
          <Link to="/employee" className="block text-white py-2 hover:opacity-80">
            ภาพรวม
          </Link>
          <Link
            to="/employee/calendar"
            className="block text-white py-2 hover:opacity-80 font-bold"
          >
            ปฏิทิน
          </Link>
          <Link to="/employee/time-log" className="block text-white py-2 hover:opacity-80">
            บันทึกเวลา
          </Link>
          <Link to="/employee/leave-request" className="block text-white py-2 hover:opacity-80">
            แจ้งขาดงาน
          </Link>
          <Link to="/employee/documents" className="block text-white py-2 hover:opacity-80">
            เอกสารของฉัน
          </Link>
          <LogoutButton className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ปฏิทินการทำงาน</h2>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="text-lg font-bold mb-4 text-center">เดือนเมษายน</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
            {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {calendarData.map((d, i) => (
              <div key={i} className={`p-2 rounded text-white ${
                d.type === 'work' ? 'bg-green-500' :
                d.type === 'ot' ? 'bg-blue-500' :
                d.type === 'absent' ? 'bg-red-500' :
                'bg-gray-300'
              }`}>
                {d.day}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-blue-500"></div>OT</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-green-500"></div>มาทำงาน</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-red-500"></div>ขาดงาน</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-yellow-300"></div>รออนุมัติ OT</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-gray-300"></div>วันหยุด</div>
          </div>
        </div>

        {/* Shift Table */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-bold text-center mb-4">ตารางเวลากะการทำงาน</h3>
          <div className="overflow-auto">
            <table className="table-fixed border border-collapse w-full text-sm text-center">
              <thead>
                <tr>
                  <th className="border p-2">เวลา</th>
                  {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, i) => <th key={i} className="border p-2">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {shiftSchedule.map((row, i) => (
                  <tr key={i}>
                    <td className="border p-1 w-20">{row.time}</td>
                    {row.slots.map((slot, j) => (
                      <td key={j} className={`border ${slot.bg} ${slot.text}`}>{slot.label}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
