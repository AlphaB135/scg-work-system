import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ เพิ่ม Link

export default function LoginPage({ setRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login success:', data);
        setRole(data.role);
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else if (data.role === 'EMPLOYEE') {
          navigate('/employee');
        } else {
          console.warn('⚠️ ไม่พบ role ที่รองรับ:', data.role);
          setError('สิทธิ์ของผู้ใช้นี้ไม่ถูกต้อง');
        }
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow w-96">
        <div className="flex justify-center mb-4">
          <img
            src="https://www.watsadupedia.com/images/2/2c/Scg.png"
            alt="SCG Logo"
            className="h-10 mr-2"
          />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">เข้าสู่ระบบ</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>
        )}

        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <p className="text-sm text-center mt-4">
          <Link to="/forgot-password" className="gray-500 hover:underline">
            ลืมรหัสผ่าน ?
          </Link>
        </p>
      </form>
    </div>
  );
}
