# SCG Dashboard - Backend Login API

##  Overview
Backend API for SCG Dashboard login system using **Express.js**, **Prisma**, and **PostgreSQL**. This module handles user authentication and issues JWT tokens for frontend usage.

---

##  Features
- ✅ `POST /api/auth/login` endpoint for login
- ✅ Uses `bcryptjs` for password hashing
- ✅ Uses `jsonwebtoken` to return signed JWT
- ✅ Prisma ORM with PostgreSQL
- ✅ Seed admin user for testing

---

##  Prisma Schema (`prisma/schema.prisma`)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String   // bcrypt hashed
  role      Role     @default(EMPLOYEE)
  fullName  String
  email     String   @unique
  ...
}
```

---

##  Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Setup .env
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/scg_dashboard
JWT_SECRET=supersecretkey
```

### 3. Migrate & Seed
```bash
npx prisma migrate reset
```
If successful, you should see:
```
 Seeded admin user successfully
```

---

## 📢 POST /api/auth/login
### URL:
```http
http://localhost:5000/api/auth/login
```
### Method:
```http
POST
```
### Body:
```json
{
  "username": "admin01",
  "password": "123456"
}
```
### Response:
```json
{
  "token": "...",
  "fullName": "Administrator",
  "role": "ADMIN"
}
```

---

##  Connect Frontend (React/Vite)
```ts
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin01", password: "123456" })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("fullName", data.fullName);
  localStorage.setItem("role", data.role);
})
.catch(console.error);
```

---

##  Middleware (แนะนำให้เพิ่ม)
เพิ่มไฟล์ `authMiddleware.js` เพื่อป้องกัน route:
```js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
```

---

##  Directory Structure
```
server/
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── .env
├── index.js
```

---

##  Seed User for Testing
```js
{
  username: "admin01",
  password: "123456",
  role: "ADMIN",
  fullName: "Administrator",
  email: "admin@example.com"
}
```

---

##  Ready to expand:
- [ ] `/api/work-records`
- [ ] `/api/explanation`
- [ ] `/api/ot-request`

---

> 📆 อัปเดตล่าสุด: 10 เม.ย. 2025
> โดย AI ผู้ช่วยโปรเจกต์ SCG

