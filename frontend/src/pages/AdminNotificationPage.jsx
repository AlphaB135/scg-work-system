import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotificationManagementPage() {
  const [customReminders, setCustomReminders] = useState([]);
  const [form, setForm] = useState({
    title: '',
    details: '',
    dueDate: '',
    notifyBeforeDays: '',
    timesPerDay: '',
    target: '',
  });

  const fetchCustomReminders = async () => {
    const res = await fetch('http://localhost:5000/api/reminders/custom', {
      credentials: 'include',
    });
    const data = await res.json();
    setCustomReminders(data);
  };

  useEffect(() => {
    fetchCustomReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/reminders/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: '', details: '', dueDate: '', notifyBeforeDays: '', timesPerDay: '', target: '' });
      fetchCustomReminders();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="bg-red-600 text-white w-64 p-6 fixed h-full">
        <div className="mb-6">
          <img
            src="https://storage.googleapis.com/be8website.appspot.com/logo-scg-white.png"
            alt="SCG Logo"
            className="w-20 mb-4"
          />
          <h1 className="text-xl font-semibold">SCG Admin</h1>
          <p className="text-sm text-white/80">Notification Management</p>
        </div>
        <nav className="space-y-2">
          <Link to="/admin" className="block py-2 hover:opacity-80">Dashboard</Link>
          <Link to="/employee-management" className="block py-2 hover:opacity-80">พนักงาน</Link>
          <Link to="/admin/finance" className="block py-2 hover:opacity-80">การเงิน</Link>
          <Link to="/admin/reminders" className="block py-2 hover:opacity-80 font-bold">แจ้งเตือน</Link>
          <Link to="/work-calendar" className="block py-2 hover:opacity-80">ปฏิทิน</Link>
          <Link to="/work-records" className="block py-2 hover:opacity-80">บันทึกเวลา</Link>
          <button className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 w-full mt-4">
            Logout
          </button>
        </nav>
      </aside>

      <div className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">จัดการแจ้งเตือน (Notifications)</h2>

        {/* Custom Reminder Form */}
        <div className="bg-white shadow p-4 rounded-xl mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">เพิ่มแจ้งเตือน (Custom Reminder)</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input name="title" value={form.title} onChange={handleChange} placeholder="หัวข้อแจ้งเตือน" className="border rounded p-2 w-full" required />
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="border rounded p-2 w-full" required />
            <textarea name="details" value={form.details} onChange={handleChange} placeholder="รายละเอียด" className="border rounded p-2 w-full md:col-span-2 h-20"></textarea>
            <input name="notifyBeforeDays" type="number" value={form.notifyBeforeDays} onChange={handleChange} placeholder="ล่วงหน้ากี่วัน" className="border rounded p-2 w-full" />
            <select name="timesPerDay" value={form.timesPerDay} onChange={handleChange} className="border rounded p-2 w-full">
              <option value="">แจ้งกี่ครั้ง/วัน</option>
              <option value="1">1 ครั้ง</option>
              <option value="2">2 ครั้ง</option>
              <option value="3">3 ครั้ง</option>
            </select>
            <select name="target" value={form.target} onChange={handleChange} className="border rounded p-2 w-full">
              <option value="">ส่งให้ใคร?</option>
              <option value="ALL">ALL</option>
              <option value="ADMIN">ADMIN</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
            </select>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-fit md:col-span-2">
              เพิ่ม Custom Reminder
            </button>
          </form>
        </div>

        {/* Reminder Table */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-bold mb-4 text-gray-800">รายการแจ้งเตือน</h3>
          <div className="overflow-auto">
            <table className="table-fixed w-full text-sm text-center border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="border p-2">หัวข้อ</th>
                  <th className="border p-2">รายละเอียด</th>
                  <th className="border p-2">วันที่</th>
                  <th className="border p-2">ล่วงหน้า</th>
                  <th className="border p-2">แจ้ง/วัน</th>
                  <th className="border p-2">ผู้รับ</th>
                </tr>
              </thead>
              <tbody>
                {customReminders.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="border p-2 text-red-600 font-bold">{r.title}</td>
                    <td className="border p-2 text-left">{r.details}</td>
                    <td className="border p-2">{new Date(r.dueDate).toLocaleDateString()}</td>
                    <td className="border p-2">{r.notifyBeforeDays || 0} วัน</td>
                    <td className="border p-2">{r.timesPerDay || 1} ครั้ง</td>
                    <td className="border p-2">{r.target}</td>
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