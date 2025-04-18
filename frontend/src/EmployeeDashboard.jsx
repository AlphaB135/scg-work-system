import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { LogOut } from 'lucide-react';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: 'Loading...', position: '' });

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

  const taskList = [
    { title: 'ข้อมูลพนักงาน', value: 9, total: 10 },
    { title: 'ข้อมูลการเงิน', value: 0, total: 10 },
    { title: 'Lorem', value: 5, total: 10 },
    { title: 'Lorem', value: 2, total: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f7]">
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

        {/* Task List */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Task List</h2>
          {taskList.map((task, index) => {
            const percent = (task.value / task.total) * 100;
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">{task.title}</p>
                  <Progress value={percent} className="h-1 bg-gray-200 rounded" />
                </div>
                <div className="text-sm text-gray-500">{task.value}/{task.total}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
