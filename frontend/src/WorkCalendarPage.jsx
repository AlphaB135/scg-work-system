import thLocale from '@fullcalendar/core/locales/th';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorkCalendarPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: '', position: '' });
  const [events, setEvents] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [showExplainForm, setShowExplainForm] = useState(false);
  const [explanationText, setExplanationText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');

    if (!token || role !== 'EMPLOYEE') return navigate('/login');
    setUser({ fullName, position: 'พนักงานฝ่าย ......' });

    const calendarData = [
      { title: 'มาทำงาน', start: '2025-04-01', className: 'bg-green-500' },
      { title: 'มาทำงาน', start: '2025-04-02', className: 'bg-green-500' },
      { title: 'วันหยุด', start: '2025-04-06', className: 'bg-gray-300' },
      { title: 'OT', start: '2025-04-05', className: 'bg-blue-500' },
      { title: 'ขาดงาน', start: '2025-04-19', className: 'bg-red-500' },
      { title: 'รออนุมัติ OT', start: '2025-04-07', className: 'bg-yellow-300' },
    ];

    setEvents(calendarData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDateClick = (info) => {
    const event = events.find(e => e.start === info.dateStr);
    if (event) {
      setSelectedInfo({
        date: info.dateStr,
        status: event.title,
        in_time: event.in_time || '-',
        out_time: event.out_time || '-'
      });
      setShowExplainForm(false);
    } else {
      setSelectedInfo(null);
      setShowExplainForm(false);
    }
  };

  const handleSubmitExplanation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/explanation/submit-explanation', {
        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ สำคัญมาก
        body: JSON.stringify({
          date: selectedInfo.date,
          explanation: explanationText,
        }),
      });

      const data = await response.json();
      response.ok
        ? alert('ส่งคำชี้แจงเรียบร้อยแล้ว')
        : alert(`เกิดข้อผิดพลาด: ${data.message}`);
    } catch (error) {
      console.error('Error:', error);
      alert('ไม่สามารถส่งคำชี้แจงได้');
    }
    setShowExplainForm(false);
    setExplanationText('');
  };

  return (
    <div className="bg-gray-100 w-screen h-screen overflow-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full h-full">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div className="text-xl font-bold flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/SCG_logo.svg" className="h-8 mr-2" alt="SCG Logo" />
            SCG
          </div>
          <button onClick={handleLogout} className="text-white text-sm underline">Logout</button>
        </div>
  
        <div className="p-10">
          <h2 className="text-center text-2xl font-bold mb-6">ตารางการทำงาน เดือนเมษายน</h2>

          {/* FullCalendar */}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={thLocale}
            events={events}
            height={600}
            eventDisplay="none"
            dateClick={handleDateClick}
            dayCellClassNames={(arg) => {
              const dateStr = arg.date.toISOString().split('T')[0];
              const matchedEvent = events.find(e => e.start === dateStr);
              return matchedEvent ? `${matchedEvent.className} text-white font-semibold` : '';
            }}
          />

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-blue-500"></div>OT</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-green-500"></div>มาทำงาน</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-red-500"></div>ขาดงาน</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-yellow-300"></div>รออนุมัติ OT</div>
            <div className="flex items-center"><div className="w-4 h-4 mr-2 rounded bg-gray-300"></div>วันหยุด</div>
          </div>

          {/* Explanation Sidebar */}
          {selectedInfo && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl shadow max-w-xl mx-auto text-sm space-y-2">
              <p><strong>วันที่:</strong> {selectedInfo.date}</p>
              <p><strong>สถานะ:</strong> {selectedInfo.status}</p>
              <p><strong>เวลาเข้า:</strong> {selectedInfo.in_time}</p>
              <p><strong>เวลาออก:</strong> {selectedInfo.out_time}</p>

              {(selectedInfo.status === 'Absent' || selectedInfo.status === 'Leave' || selectedInfo.status === 'Late') && (
                !showExplainForm ? (
                  <button
                    onClick={() => setShowExplainForm(true)}
                    className="mt-2 px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 w-full"
                  >
                    แจ้งขอชี้แจงเวลาเข้าออก
                  </button>
                ) : (
                  <div className="space-y-2 mt-2">
                    <textarea
                      className="w-full border rounded p-2"
                      rows="3"
                      placeholder="กรุณาระบุสาเหตุ เช่น ลืมแปะบัตร..."
                      value={explanationText}
                      onChange={(e) => setExplanationText(e.target.value)}
                    ></textarea>
                    <button
                      onClick={handleSubmitExplanation}
                      className="w-full bg-[#d83b2f] text-white py-1 rounded hover:bg-[#bb2f24]"
                    >
                      ส่งคำชี้แจง
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
