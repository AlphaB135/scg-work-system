// AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';

// === เพิ่มสำหรับใช้งาน Charts ===
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({
    missingDocs: 0,
    noSSO: 0,
    unexcusedAbsents: 0
  });
  const [loading, setLoading] = useState(true);

  // เรียกใช้งาน API เพื่อตรวจสอบ session (me)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/me', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not authenticated');
        await res.json();
      } catch (err) {
        console.error('❌ Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ดึงข้อมูลพนักงานและคำนวณสรุป
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();

        setUsers(data);

        const missingDocs = data.filter(u => !u.individualSetting?.note).length;
        const noSSO = data.filter(u => u.sso === false).length;

        setSummary(prev => ({
          ...prev,
          missingDocs,
          noSSO
        }));
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        setUsers([]);
      }
    };

    const fetchUnexcusedAbsents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/work-records/unexcused', {
          credentials: 'include',
        });
        const data = await res.json();
        setSummary(prev => ({ ...prev, unexcusedAbsents: data.length }));
      } catch (err) {
        console.error('❌ Error fetching absents:', err);
      }
    };

    fetchUsers();
    fetchUnexcusedAbsents();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // ---- เตรียมข้อมูลกราฟโดนัท (Doughnut) ----
  const doughnutData = {
    labels: ['ขาดเอกสาร', 'ไม่มี SSO', 'ขาดงานไม่แจ้ง'],
    datasets: [
      {
        label: 'จำนวน',
        data: [
          summary.missingDocs,
          summary.noSSO,
          summary.unexcusedAbsents
        ],
        backgroundColor: [
          '#facc15', // เหลือง
          '#f87171', // แดงอ่อน
          '#fb923c'  // ส้ม
        ]
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
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
          <h1 className="text-xl font-semibold">SCG Admin</h1>
          <p className="text-sm text-white/80">ระบบจัดการพนักงาน</p>
        </div>
        <nav className="space-y-2">
          <Link to="/admin" className="block text-white py-2 hover:opacity-80 font-bold">
            ภาพรวม
          </Link>
          <Link to="/employee-management" className="block text-white py-2 hover:opacity-80">
            จัดการพนักงาน
          </Link>
          <Link to="/admin/finance" className="block text-white py-2 hover:opacity-80">
            การเงิน
          </Link>
          <Link to="/admin/reminders" className="block text-white py-2 hover:opacity-80">
            แจ้งเตือน
          </Link>
          <Link to="/work-calendar" className="block text-white py-2 hover:opacity-80">
            ปฏิทิน
          </Link>
          <Link to="/work-records" className="block text-white py-2 hover:opacity-80">
            บันทึกเวลา
          </Link>
          <LogoutButton className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        {/* Greeting */}
        <div className="mb-6 bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              สวัสดี, Admin! 
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              ยินดีต้อนรับเข้าสู่หน้า **ภาพรวม** ระบบจัดการพนักงาน
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-600">
              พนักงานทั้งหมด: <span className="font-semibold">{users.length} คน</span>
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card 1: ขาดเอกสาร */}
          <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">📄</div>
              <h3 className="font-semibold text-gray-700">ขาดเอกสาร</h3>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-red-600">{summary.missingDocs}</span>
              <span className="ml-2 text-sm text-gray-500">คน</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              จำเป็นต้องอัปโหลดสำเนาเอกสารเพิ่มเติม
            </p>
            <Link
              to="/employee-management?filter=missingDocs"
              className="mt-3 inline-block text-xs text-blue-600 hover:underline"
            >
              ดูรายละเอียด →
            </Link>
          </div>

          {/* Card 2: ไม่มี SSO */}
          <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">🛡️</div>
              <h3 className="font-semibold text-gray-700">ยังไม่มีประกันสังคม</h3>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-orange-500">{summary.noSSO}</span>
              <span className="ml-2 text-sm text-gray-500">คน</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ต้องดำเนินการลงทะเบียน SSO โดยด่วน
            </p>
            <Link
              to="/employee-management?filter=noSSO"
              className="mt-3 inline-block text-xs text-blue-600 hover:underline"
            >
              ดูรายละเอียด →
            </Link>
          </div>

          {/* Card 3: ขาดงานไม่แจ้ง */}
          <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">📅</div>
              <h3 className="font-semibold text-gray-700">ขาดงานไม่แจ้ง</h3>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-red-600">{summary.unexcusedAbsents}</span>
              <span className="ml-2 text-sm text-gray-500">เคส</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              รอพิจารณาการลงโทษ หรือปรับเงิน
            </p>
            <Link
              to="/work-records?filter=unexcused"
              className="mt-3 inline-block text-xs text-blue-600 hover:underline"
            >
              ดูรายละเอียด →
            </Link>
          </div>
        </div>

        {/* Chart Overview */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">สรุปภาพรวม (Doughnut Chart)</h3>
          <div className="max-w-sm mx-auto">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-4">
            แสดงจำนวนปัญหาที่พบในระบบเป็นแผนภูมิวงกลม
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/employee-management?filter=missingDocs"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg p-4 flex items-center justify-center text-center"
            >
              จัดการผู้ขาดเอกสาร
            </Link>
            <Link
              to="/employee-management?filter=noSSO"
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium rounded-lg p-4 flex items-center justify-center text-center"
            >
              ดำเนินการประกันสังคม
            </Link>
            <Link
              to="/work-records?filter=unexcused"
              className="bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg p-4 flex items-center justify-center text-center"
            >
              ติดตามการขาดงาน
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            เลือกปุ่มด้านบนเพื่อดำเนินการแก้ไข/ติดตามได้ทันที
          </p>
        </div>

        {/* Table: รายชื่อพนักงาน (Optional) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-bold mb-2 text-gray-700">รายชื่อพนักงาน</h3>
          <p className="text-xs text-gray-500 mb-3">ข้อมูลสถานะเอกสาร ประกันสังคม และภาษี</p>
          <div className="overflow-auto">
            <table className="table-fixed w-full text-sm text-center border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 border">รหัส</th>
                  <th className="p-2 border">ชื่อ-สกุล</th>
                  <th className="p-2 border">เอกสาร</th>
                  <th className="p-2 border">ประกันสังคม</th>
                  <th className="p-2 border">ภาษี</th>
                  <th className="p-2 border">ตัวเลือก</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border p-2">{user.code || `EMP${user.id}`}</td>
                    <td className="border p-2 text-left">{user.fullName}</td>
                    <td className="border p-2">
                      {user.individualSetting?.note ? (
                        <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                          ครบ
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                          ขาด
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      {user.sso ? (
                        <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                          มี
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                          ไม่มี
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      {user.tax ? (
                        <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                          เรียบร้อย
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                          ยัง
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      <Link
                        to={`/employee-management/${user.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-gray-500">
                      ไม่มีข้อมูลพนักงาน
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
