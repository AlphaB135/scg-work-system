import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

export default function UploadWorkRecordPage() {
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setMessage('');
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setRecords(result.data);
        setCurrentPage(1);
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/upload-work-records', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

      setMessage(data.message);
      setRecords([]);
    } catch (err) {
      console.error('❌ Error uploading:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">อัปโหลดข้อมูลการเข้าออกงาน</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 p-2 rounded mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          disabled={loading || !file}
        >
          {loading ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์ CSV'}
        </button>
        {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}

        {records.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">พรีวิวข้อมูล ({records.length} รายการ)</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">EmployeeCode</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">DayType</th>
                    <th className="border px-2 py-1">ClockIn</th>
                    <th className="border px-2 py-1">ClockOut</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{row.EmployeeCode}</td>
                      <td className="border px-2 py-1">{row.Date}</td>
                      <td className="border px-2 py-1">{row.DayType}</td>
                      <td className="border px-2 py-1">{row.ClockIn}</td>
                      <td className="border px-2 py-1">{row.ClockOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/employee-management')}
          className="mt-6 text-sm text-gray-500 hover:underline"
        >
          ← กลับไปหน้าจัดการพนักงาน
        </button>
      </div>
    </div>
  );
}
