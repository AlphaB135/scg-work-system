// /pages/EmployeeDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">รายละเอียดพนักงาน</h1>
      <div className="space-y-2 text-gray-800">
        <p><strong>ชื่อ:</strong> {user.fullName}</p>
        <p><strong>รหัส:</strong> {user.employeeCode}</p>
        <p><strong>ตำแหน่ง:</strong> {user.position}</p>
        <p><strong>สาขา:</strong> {user.branch}</p>
        <p><strong>แผนก:</strong> {user.department}</p>
        <p><strong>บริษัท:</strong> {user.company}</p>
        <p><strong>เบอร์โทร:</strong> {user.phone}</p>
        <p><strong>อีเมล:</strong> {user.email}</p>
        <p><strong>เงินเดือน:</strong> {user.salary} บาท</p>
        <p><strong>ประกันสังคม:</strong> {user.sso ? '✔️' : '❌'}</p>
        <p><strong>ภาษี:</strong> {user.tax ? '✔️' : '❌'}</p>
      </div>
      <Link to="/employee-management" className="mt-4 inline-block text-blue-600 hover:underline">← กลับไปหน้าจัดการพนักงาน</Link>
    </div>
  );
}
