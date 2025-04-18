import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const months = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export default function WorkSchedulePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: '', position: '' });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');

    if (!token || role !== 'EMPLOYEE') return navigate('/login');
    setUser({ fullName, position: 'พนักงานฝ่าย ......' });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <div className="bg-[#d83b2f] text-white px-6 py-4 flex items-center justify-between">
        <img src="/scg-logo.png" alt="SCG Logo" className="h-8" />
        <div className="cursor-pointer">
          <svg width="24" height="24"><path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" /></svg>
        </div>
      </div>

      <div className="flex max-w-5xl mx-auto mt-6 px-4 gap-6">
        {/* Sidebar */}
        <div className="w-1/3 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-300" />
            <h3 className="text-center font-bold mt-4">{user.fullName}</h3>
            <p className="text-center text-sm text-gray-500">{user.position}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-[#d83b2f] hover:bg-[#bb2f24] text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Main Section */}
        <div className="flex-1 space-y-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">ตารางการทำงาน เดือน{months[currentMonth]}</h2>
              <div className="space-x-2">
                <button onClick={handlePrevMonth} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">ย้อนกลับ</button>
                <button onClick={handleNextMonth} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">ถัดไป</button>
              </div>
            </div>
            <img src="/calendar-example.png" alt="Work Calendar" className="w-full rounded-md" />
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">ตารางเวลาการทำงาน</h2>
            <img src="/timeline-example.png" alt="Work Timeline" className="w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
