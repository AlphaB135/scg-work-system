// FinanceManagementPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// เพิ่มสำหรับใช้งาน Chart
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FinanceManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");    // state สำหรับค้นหา
  const [currentPage, setCurrentPage] = useState(1);   // state สำหรับ pagination
  const [employeesPerPage] = useState(10);             // กำหนดจำนวน row ต่อหน้า

  // ดึงข้อมูล
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users', {
          credentials: 'include'
        });
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      }
    };
    fetchEmployees();
  }, []);

  // ฟังก์ชันสร้างเอกสาร
  const handleGenerateDocuments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payroll/generate-docs', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');
      alert(`✅ สำเร็จ: ${data.message}`);
    } catch (err) {
      console.error('❌ Generate Error:', err);
      alert('❌ ไม่สามารถสร้างเอกสารได้');
    }
  };

  // ฟังก์ชันส่งข้อมูลเข้า SSO/ภาษี
  const handleSubmitToSystems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payroll/submit-all', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');
      alert(`✅ ส่งสำเร็จ: ${data.message}`);
    } catch (err) {
      console.error('❌ Submit Error:', err);
      alert('❌ ไม่สามารถส่งข้อมูลเข้าสู่ระบบภายนอกได้');
    }
  };

  // -- คำนวณเพื่อใช้แสดงบน summary และ chart --
  const totalEmployees = employees.length;
  const completedTax = employees.filter((e) => e.tax).length;
  const pendingTax = totalEmployees - completedTax;
  const completedSSO = employees.filter((e) => e.sso).length;
  const pendingSSO = totalEmployees - completedSSO;

  // ข้อมูลสำหรับกราฟโดนัท (Doughnut)
  const chartData = {
    labels: ['ยังไม่ส่งภาษี', 'ส่งภาษีแล้ว', 'ยังไม่ส่งSSO', 'ส่งSSOแล้ว'],
    datasets: [
      {
        label: 'Summary',
        data: [pendingTax, completedTax, pendingSSO, completedSSO],
        backgroundColor: [
          '#facc15', // สีเหลือง
          '#4ade80', // สีเขียว
          '#fbbf24', // ส้ม
          '#34d399'  // เขียวอ่อน
        ]
      }
    ]
  };

  // ฟิลเตอร์ข้อมูลตามคำค้นหา (searchTerm)
  const filteredEmployees = employees.filter((emp) => {
    // ค้นหาตามชื่อ (fullName) หรือ employeeCode
    const searchLower = searchTerm.toLowerCase();
    return (
      (emp.fullName && emp.fullName.toLowerCase().includes(searchLower)) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(searchLower))
    );
  });

  // --- Pagination ---
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
          <p className="text-sm text-white/80">การจัดการการเงิน</p>
        </div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin" className="block py-2 hover:opacity-80"> ภาพรวม</Link>
          <Link to="/employee-management" className="block py-2 hover:opacity-80"> จัดการพนักงาน</Link>
          <Link to="/admin/finance" className="block py-2 hover:opacity-80 font-bold"> การเงิน</Link>
          <Link to="/admin/reminders" className="block py-2 hover:opacity-80"> แจ้งเตือน</Link>
          <Link to="/work-calendar" className="block py-2 hover:opacity-80"> ปฏิทิน</Link>
          <Link to="/work-records" className="block py-2 hover:opacity-80"> บันทึกเวลา</Link>
          <button className="bg-white text-red-600 font-bold py-2 px-4 roundedhover:bg-gray-200 w-full mt-4">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-6">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4"> การจัดการการเงิน</h2>

        {/* Section: Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">ยังไม่ส่งภาษี</p>
            <h3 className="text-2xl font-bold text-yellow-600">{pendingTax}</h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">ส่งภาษีแล้ว</p>
            <h3 className="text-2xl font-bold text-green-600">{completedTax}</h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">ยังไม่ส่ง SSO</p>
            <h3 className="text-2xl font-bold text-yellow-600">{pendingSSO}</h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">ส่ง SSO แล้ว</p>
            <h3 className="text-2xl font-bold text-green-600">{completedSSO}</h3>
          </div>
        </div>

        {/* Section: Chart */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">ภาพรวมการส่งเอกสาร (ภาษี/SSO)</h3>
          <div className="max-w-xs mx-auto">
            <Doughnut data={chartData} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <p className="text-gray-700 text-sm">
              รายการพนักงานที่ยังไม่ส่งเอกสารครบ เช่น ภาษี และประกันสังคม
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleGenerateDocuments}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                📄 สร้างเอกสารภาษี / SSO
              </button>
              <button
                onClick={handleSubmitToSystems}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                📤 ส่งชื่อพนักงานเข้าระบบภาษี / SSO
              </button>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-bold">ค้นหาพนักงาน</h3>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-64"
              placeholder="ค้นหาตามชื่อหรือรหัสพนักงาน"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4"> รายการพนักงาน</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 border">รหัส</th>
                  <th className="p-2 border">ชื่อ-สกุล</th>
                  <th className="p-2 border">ภาษี</th>
                  <th className="p-2 border">ประกันสังคม</th>
                  <th className="p-2 border">ตัวเลือก</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="border p-2">{emp.employeeCode || `EMP${emp.id}`}</td>
                    <td className="border p-2 text-left">{emp.fullName}</td>
                    <td className="border p-2">
                      {emp.tax ? (
                        <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">ส่งแล้ว</span>
                      ) : (
                        <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">ยังไม่ส่ง</span>
                      )}
                    </td>
                    <td className="border p-2">
                      {emp.sso ? (
                        <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">ส่งแล้ว</span>
                      ) : (
                        <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">ยังไม่ส่ง</span>
                      )}
                    </td>
                    <td className="border p-2">
                      <button className="text-blue-600 hover:underline text-sm">ดูรายละเอียด</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handleChangePage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
