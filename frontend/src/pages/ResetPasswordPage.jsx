import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { token } = useParams(); // สมมติ URL = /reset-password/:token
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ รีเซ็ตรหัสผ่านสำเร็จ กำลังกลับไปหน้าเข้าสู่ระบบ...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      setStatus('❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">ตั้งรหัสผ่านใหม่</h2>
        {status && <div className="mb-3 text-sm text-center">{status}</div>}

        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          ตั้งรหัสผ่านใหม่
        </button>
      </form>
    </div>
  );
}
