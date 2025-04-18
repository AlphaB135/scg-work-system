import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function EmployeeManagementPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (department === '' || user.department === department)
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="bg-red-600 text-white w-64 p-6 fixed h-full">
        <div className="mb-6">
          <img
            src="https://storage.googleapis.com/be8website.appspot.com/logo-scg-white.png"
            alt="SCG Logo"
            className="w-20 mb-4"
          />
          <h1 className="text-xl font-semibold">SCG Admin</h1>
          <p className="text-sm text-white/80">Employee Management</p>
        </div>
        <nav className="space-y-2">
          <Link to="/admin" className="block py-2 hover:opacity-80">ภาพรวม</Link>
          <Link to="/employee-management" className="block py-2 hover:opacity-80 font-bold">จัดการพนักงาน</Link>
          <Link to="/admin/finance" className="block py-2 hover:opacity-80">การเงิน</Link>
          <Link to="/admin/reminders" className="block py-2 hover:opacity-80">แจ้งเตือน</Link>
          <Link to="/work-calendar" className="block py-2 hover:opacity-80">ปฏิทิน</Link>
          <Link to="/work-records" className="block py-2 hover:opacity-80">บันทึกเวลา</Link>
          <button className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">จัดการพนักงาน</h2>

        {/* ฟอร์มค้นหา/กรอง */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">ค้นหาพนักงาน</label>
            <input
              type="text"
              placeholder="ชื่อ / รหัสพนักงาน"
              className="border p-2 rounded w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">แผนก / ตำแหน่ง</label>
            <select
              className="border p-2 rounded w-64"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 self-end">
            ค้นหา
          </button>
        </div>

        {/* ปุ่ม Import/Export */}
        <div className="flex items-center gap-2 mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Import CSV
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Export CSV
          </button>
          <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate('/upload-work-records')}
            >
             อัปโหลดข้อมูลเวลาเข้า-ออกงาน CSV
            </button>
        </div>

        {/* ตารางพนักงาน */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-2">รายชื่อพนักงาน</h3>
          <div className="overflow-auto">
            <table className="w-full table-fixed border-collapse text-sm text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-2 w-20">รหัส</th>
                  <th className="border p-2 w-32">ชื่อ-สกุล</th>
                  <th className="border p-2 w-24">แผนก</th>
                  <th className="border p-2 w-24">ตำแหน่ง</th>
                  <th className="border p-2 w-20">สถานะ</th>
                  <th className="border p-2 w-36">ตัวเลือก</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border p-2">EMP{user.id}</td>
                    <td className="border p-2 text-left">{user.fullName}</td>
                    <td className="border p-2">{user.department || '-'}</td>
                    <td className="border p-2">{user.position || '-'}</td>
                    <td className="border p-2">
                      <span className="inline-block px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full">
                        ทำงานอยู่
                      </span>
                    </td>
                    <td className="border p-2 space-x-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">
                        แก้ไข
                      </button>
                      <Link to={`/employee-management/${user.id}`} className="text-blue-600 hover:underline">
  ดูรายละเอียด
</Link>
                    </td>
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