import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token; // ดึงจาก cookies

  if (!token) {
    return res.status(401).json({ message: 'ไม่ได้เข้าสู่ระบบ' }); // ไม่มี token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบความถูกต้องของ token
    console.log(decoded); 
    req.user = decoded; // เก็บข้อมูลผู้ใช้ใน req.user
    next(); // ไปที่ next middleware หรือ route handler
  } catch (error) {
    res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
  }
};
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};