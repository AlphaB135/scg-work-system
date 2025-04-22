import React, { useEffect, useState } from 'react';

export default function SupervisorExplanationPage() {
  const [explanations, setExplanations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/explanation/pending', {
          credentials: 'include'
        });
        const data = await res.json();
        setExplanations(data);
      } catch (err) {
        console.error('โหลดคำชี้แจงล้มเหลว', err);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/explanation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'APPROVED' })
      });
      if (res.ok) {
        setExplanations(prev => prev.filter(e => e.id !== id));
        alert('✅ อนุมัติเรียบร้อย');
      }
    } catch (err) {
      console.error('อนุมัติคำชี้แจงล้มเหลว', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/explanation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'REJECTED' })
      });
      if (res.ok) {
        setExplanations(prev => prev.filter(e => e.id !== id));
        alert('❌ ปฏิเสธเรียบร้อย');
      }
    } catch (err) {
      console.error('ปฏิเสธคำชี้แจงล้มเหลว', err);
    }
  };

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">รายการคำชี้แจงรออนุมัติ</h2>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ชื่อพนักงาน</th>
            <th className="p-2">วันที่</th>
            <th className="p-2">คำชี้แจง</th>
            <th className="p-2">สถานะ</th>
            <th className="p-2 text-center">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {explanations.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.employee.fullName}</td>
              <td className="p-2">{new Date(item.date).toLocaleDateString('th-TH')}</td>
              <td className="p-2">{item.explanation}</td>
              <td className="p-2">{item.status}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                >
                  อนุมัติ
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ปฏิเสธ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}