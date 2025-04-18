import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

export default function EmployeeCalendarPage() {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/my-work-calendar?month=${month}&year=${year}`, {
        credentials: 'include',
      });
      const data = await res.json();

      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDayIndex = new Date(year, month - 1, 1).getDay(); // Sunday = 0

      const mapped = [];

      // เติมช่องว่างก่อนวันที่ 1
      for (let i = 0; i < firstDayIndex; i++) {
        mapped.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const dayData = data.find(d => d.day === i);
        if (dayData) {
          mapped.push({
            day: i,
            type: dayData.type,
            checkIn: formatTime(dayData.checkIn),
            checkOut: formatTime(dayData.checkOut),
            rawCheckIn: dayData.checkIn,
            rawCheckOut: dayData.checkOut,
            statusText: dayData.statusText || ''
          });
        } else {
          mapped.push({
            day: i,
            type: 'unknown',
            checkIn: '-',
            checkOut: '-',
            statusText: 'ไม่พบข้อมูล'
          });
        }
      }

      setCalendarData(mapped);
    } catch (err) {
      console.error('Error loading calendar:', err);
    }
  };

  const formatTime = (datetimeString) => {
    if (!datetimeString || datetimeString === '-') return '-';
    const d = new Date(datetimeString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleDayClick = (d) => {
    if (!d) return;
    setSelectedDay(d);
    setModalOpen(true);
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'work': return 'bg-green-500';
      case 'late': return 'bg-yellow-400';
      case 'early': return 'bg-orange-400';
      case 'absent': return 'bg-red-500';
      case 'holiday': return 'bg-gray-300 text-gray-600';
      case 'ot': return 'bg-blue-500';
      default: return 'bg-gray-200';
    }
  };

  const calculateOTHours = (co) => {
    if (!co || co === '-') return 0;
    let [h, m] = co.split(':').map(Number);
    let hrs = h - 16, mins = m - 30;
    if (mins < 0) { hrs--; mins += 60; }
    return hrs + mins / 60;
  };

  const summary = calendarData.reduce((acc, d) => {
    if (!d) return acc;
    switch (d.type) {
      case 'work': acc.work++; break;
      case 'late': acc.late++; break;
      case 'early': acc.early++; break;
      case 'absent': acc.absent++; break;
      case 'ot': acc.otHours += calculateOTHours(d.checkOut); break;
      default: break;
    }
    return acc;
  }, { work: 0, late: 0, early: 0, absent: 0, otHours: 0 });

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex">
      <aside className="bg-red-600 text-white w-64 p-6 fixed h-full">
        <div className="mb-6">
          <img src="https://storage.googleapis.com/be8website.appspot.com/logo-scg-white.png" alt="SCG Logo" className="w-20 mb-4" />
          <h1 className="text-xl font-semibold">SCG Employee</h1>
          <p className="text-sm text-white/80">ระบบสำหรับพนักงาน</p>
        </div>
        <nav className="space-y-2">
          <Link to="/employee" className="block text-white py-2 hover:opacity-80">ภาพรวม</Link>
          <Link to="/employee/calendar" className="block text-white py-2 font-bold">ปฏิทิน</Link>
          <Link to="/employee/time-log" className="block text-white py-2 hover:opacity-80">บันทึกเวลา</Link>
          <Link to="/employee/leave-request" className="block text-white py-2 hover:opacity-80">แจ้งขาดงาน</Link>
          <Link to="/employee/documents" className="block text-white py-2 hover:opacity-80">เอกสารของฉัน</Link>
          <LogoutButton className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4" />
        </nav>
      </aside>

      <div className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ปฏิทินการทำงาน</h2>

        <div className="flex gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-700 mr-2">เดือน:</label>
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="p-2 border rounded">
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString('th-TH', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 mr-2">ปี:</label>
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="p-2 border rounded">
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold mb-4">
          {new Date(year, month - 1).toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
        </h3>

        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
          {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d,i) => <div key={i}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {calendarData.map((d,i) => (
            d ? (
              <div
                key={i}
                onClick={() => handleDayClick(d)}
                className={`p-2 rounded cursor-pointer hover:scale-105 transition-all ${getBgClass(d.type)} ${d.type === 'holiday' ? 'text-gray-600' : 'text-white'}`}
              >
                <div className="font-medium">{d.day}</div>
                {['late','early','absent','ot','holiday'].includes(d.type) && (
                  <div className="text-xs mt-1 truncate">{d.statusText}</div>
                )}
              </div>
            ) : (
              <div key={i} className="p-2"></div>
            )
          ))}
        </div>
      </div>

      {modalOpen && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-2 right-3 text-gray-600 text-xl">×</button>
            <h3 className="text-lg font-bold mb-4">
              วันที่ {selectedDay.day} {new Date(year, month - 1).toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
            </h3>
            <p><strong>Check-In:</strong> {selectedDay.checkIn}</p>
            <p><strong>Check-Out:</strong> {selectedDay.checkOut}</p>
            <p><strong>สถานะ:</strong> {selectedDay.statusText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
