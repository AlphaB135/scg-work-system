import React, { useEffect, useState } from 'react';

export default function SupervisorExplanationPage() {
  const [pendingExplanations, setPendingExplanations] = useState([]);
  const [historyExplanations, setHistoryExplanations] = useState([]);

  useEffect(() => {
    fetchPending();
    fetchHistory();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/explanation/pending', {
        credentials: 'include'
      });
      const data = await res.json();
      setPendingExplanations(data);
    } catch (err) {
      console.error('โหลดคำชี้แจงรออนุมัติล้มเหลว', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/explanation/history', {
        credentials: 'include'
      });
      const data = await res.json();
      setHistoryExplanations(data);
    } catch (err) {
      console.error('โหลดประวัติคำชี้แจงล้มเหลว', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/explanation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'APPROVED' })
      });
      if (res.ok) {
        fetchPending();
        fetchHistory();
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
        fetchPending();
        fetchHistory();
        alert('❌ ปฏิเสธเรียบร้อย');
      }
    } catch (err) {
      console.error('ปฏิเสธคำชี้แจงล้มเหลว', err);
    }
  };

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">📌 คำชี้แจงรออนุมัติ</h2>
      <table className="w-full border text-sm mb-10">
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
          {pendingExplanations.map((item) => (
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

      <h2 className="text-xl font-bold mb-4">📄 ประวัติการอนุมัติ / ปฏิเสธ</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ชื่อพนักงาน</th>
            <th className="p-2">วันที่</th>
            <th className="p-2">คำชี้แจง</th>
            <th className="p-2">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {historyExplanations.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.employee.fullName}</td>
              <td className="p-2">{new Date(item.date).toLocaleDateString('th-TH')}</td>
              <td className="p-2">{item.explanation}</td>
              <td className={`p-2 font-bold ${item.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                {item.status === 'APPROVED' ? '✅ อนุมัติแล้ว' : '❌ ปฏิเสธแล้ว'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
