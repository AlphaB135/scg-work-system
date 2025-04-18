// File: server/scripts/seed-user.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: password,
      fullName: 'แอดมินระบบ',
      email: 'admin@scg.com',
      role: 'ADMIN',
      position: 'หัวหน้า',
      department: 'HR',
    },
  });

  console.log('✅ สร้าง user สำเร็จ:', user);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
