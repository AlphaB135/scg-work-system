import React, { useEffect, useState } from 'react';

export default function SupervisorExplanationPage() {
  const [explanations, setExplanations] = useState([]);

  useEffect(() => {
    // ตอนนี้ใช้ mock data ทดสอบก่อน
    const mockData = [
      {
        id: 'exp1',
        employee: { firstName: 'ณัฐพล', lastName: 'ใจดี' },
        date: '2025-04-17',
        explanation: 'ไปหาหมอ มีใบรับรองแพทย์',
        status: 'PENDING',
      },
      {
        id: 'exp2',
        employee: { firstName: 'อังคณา', lastName: 'นวลใส' },
        date: '2025-04-16',
        explanation: 'ติดธุระด่วนที่บ้าน',
        status: 'PENDING',
      },
      {
        id: 'exp1',
        employee: { firstName: 'ณัฐพล', lastName: 'ใจดี' },
        date: '2025-04-17',
        explanation: 'ไปหาหมอ มีใบรับรองแพทย์',
        status: 'PENDING',
      },
      {
        id: 'exp2',
        employee: { firstName: 'อังคณา', lastName: 'นวลใส' },
        date: '2025-04-16',
        explanation: 'ติดธุระด่วนที่บ้าน',
        status: 'PENDING',
      },
    ];
    setExplanations(mockData);
  }, []);

  const handleApprove = (id) => {
    alert(`✅ อนุมัติคำชี้แจง ${id}`);
    // TODO: call API PUT /api/explanations/:id
  };

  const handleReject = (id) => {
    alert(`❌ ปฏิเสธคำชี้แจง ${id}`);
    // TODO: call API PUT /api/explanations/:id
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
              <td className="p-2">{item.employee.firstName} {item.employee.lastName}</td>
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
