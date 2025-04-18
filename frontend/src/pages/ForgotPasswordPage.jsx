import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ กรุณาตรวจสอบอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน');
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      setStatus('❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">ลืมรหัสผ่าน</h2>
        {status && <div className="mb-3 text-sm text-center">{status}</div>}

        <input
          type="email"
          placeholder="กรอกอีเมลที่ลงทะเบียน"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          ส่งคำขอเปลี่ยนรหัสผ่าน
        </button>
      </form>
    </div>
  );
}
