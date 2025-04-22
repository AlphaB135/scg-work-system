import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

export default function EmployeeCalendarPage() {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [popoverIndex, setPopoverIndex] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [user, setUser] = useState(null);
  const [explanationMap, setExplanationMap] = useState({});

  useEffect(() => {
    fetchUser();
    fetchData();
  }, [month, year]);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/me', { credentials: 'include' });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/my-work-calendar?month=${month}&year=${year}`, {
        credentials: 'include'
      });
      const data = await res.json();

      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDayIndex = new Date(year, month - 1, 1).getDay();

      const mapped = [];
      const map = {};

      for (let i = 0; i < firstDayIndex; i++) mapped.push(null);

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
          if (dayData.explanation) map[i] = dayData.explanation;
        } else {
          mapped.push({ day: i, type: 'unknown', checkIn: '-', checkOut: '-', statusText: 'ไม่พบข้อมูล' });
        }
      }

      while (mapped.length < 42) mapped.push(null);

      setCalendarData(mapped);
      setExplanationMap(map);
    } catch (err) {
      console.error('Error loading calendar:', err);
    }
  };

  const formatTime = datetimeString => {
    if (!datetimeString || datetimeString === '-') return '-';
    const d = new Date(datetimeString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleDayClick = (d, index) => {
    if (popoverIndex === index) {
      setSelectedDay(null);
      setPopoverIndex(null);
    } else {
      setSelectedDay(d);
      setPopoverIndex(index);
    }
  };

  const handleExplanationSubmit = async (d) => {
    const existingExplanation = explanationMap[d.day];
    const explanation = prompt(`กรุณาระบุคำชี้แจงสำหรับวันที่ ${d.day}`, existingExplanation || '');
    if (!explanation) return;

    const date = `${year}-${String(month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;

    try {
      const res = await fetch('http://localhost:5000/api/submit-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ date, explanation })
      });

      const result = await res.json();
      if (res.ok) {
        setExplanationMap(prev => ({ ...prev, [d.day]: explanation }));
        fetchData();
        alert('ส่งคำชี้แจงเรียบร้อยแล้ว');
      } else {
        alert(result.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      alert('ส่งไม่สำเร็จ');
    }
  };

  function getBgClass(type) {
    switch (type) {
      case 'work': return 'bg-green-500';
      case 'late': return 'bg-yellow-400';
      case 'early': return 'bg-orange-400';
      case 'absent': return 'bg-red-500';
      case 'holiday': return 'bg-gray-300 text-gray-600';
      case 'ot': return 'bg-blue-500';
      case 'leave': return 'bg-fuchsia-500 text-white';
      default: return 'bg-gray-200';
    }
  }

  function calculateOTHours(checkOut) {
    if (!checkOut || checkOut === '-') return 0;
    let [h, m] = checkOut.split(':').map(Number);
    let hrs = h - 16, mins = m - 30;
    if (mins < 0) { hrs--; mins += 60; }
    return hrs + mins / 60;
  }

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

        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
          {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {calendarData.map((d, i) => {
            if (!d) return <div key={i} className="p-2 h-20 bg-gray-100 rounded" />;
            const isSelected = i === popoverIndex;
            const hasExplanation = explanationMap[d.day];

            return (
              <div key={i} className="relative">
                <div
                  onClick={() => handleDayClick(d, i)}
                  className={`p-4 h-24 flex flex-col justify-center rounded cursor-pointer hover:scale-105 transition-all ${getBgClass(d.type)} ${d.type==='holiday'? 'text-gray-600':'text-white'}`}
                >
                  <div className="font-medium text-lg">{d.day}</div>
                  {['late','early','absent','ot','holiday','leave'].includes(d.type) && (
                    <div className="text-xs mt-1 truncate">{d.statusText}</div>
                  )}
                </div>

                {isSelected && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10 w-72 bg-white rounded-lg shadow-lg p-4 text-left text-sm">
                    <h4 className="font-bold mb-1">
                      วันที่ {d.day} {new Date(year, month-1).toLocaleString('th-TH',{ month:'long', year:'numeric'})}
                    </h4>
                    <p><strong>Check‑In:</strong> {d.checkIn}</p>
                    <p><strong>Check‑Out:</strong> {d.checkOut}</p>
                    <p><strong>สถานะ:</strong> {d.statusText}</p>
                    {['absent', 'late'].includes(d.type) && (
                      <>
                        {hasExplanation ? (
                          <button
                            onClick={() => handleExplanationSubmit(d)}
                            className="mt-2 bg-gray-200 text-blue-600 px-3 py-1 rounded hover:bg-gray-300 text-sm flex items-center justify-center"
                          >
                            ✅ ส่งแล้ว <span className="ml-2">✏️</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleExplanationSubmit(d)}
                            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                          >
                            ส่งคำชี้แจง
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}