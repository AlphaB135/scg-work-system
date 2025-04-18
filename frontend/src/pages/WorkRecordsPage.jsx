// File: src/pages/WorkRecordsPage.jsx
import { useEffect, useState } from 'react';

export default function WorkRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkRecords = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/work-records', {
        credentials: 'include', // ✅ เพื่อให้ cookie JWT ถูกส่งไปด้วย
      });
  
      if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchWorkRecords();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">บันทึกการทำงานของคุณ</h2>
      {loading ? (
        <p>⏳ กำลังโหลดข้อมูล...</p>
      ) : (
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">วันที่</th>
              <th className="border p-2">เวลาเข้า</th>
              <th className="border p-2">เวลาออก</th>
              <th className="border p-2">สถานะ</th>
              <th className="border p-2">OT (ชม.)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{new Date(r.date).toLocaleDateString('th-TH')}</td>
                <td className="border p-2">{r.checkIn || '-'}</td>
                <td className="border p-2">{r.checkOut || '-'}</td>
                <td className="border p-2">{r.status}</td>
                <td className="border p-2">{r.overtime || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
