import prisma from '../utils/prismaClient.js';

export const getReminders = async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลแจ้งเตือนได้', error });
  }
};

export const createFixedReminder = async (req, res) => {
  const { title, details, dueDate, target, repeat, type } = req.body;
  try {
    const reminder = await prisma.reminder.create({
      data: {
        title,
        details,
        dueDate: new Date(dueDate),
        target: target || 'ALL',
        repeat: repeat || null,
        type: type || 'FIXED',
      },
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถเพิ่มแจ้งเตือนได้', error });
  }
};

export const updateReminder = async (req, res) => {
  const { id } = req.params;
  const { title, details, dueDate, target, repeat, isDone } = req.body;
  try {
    const reminder = await prisma.reminder.update({
      where: { id: parseInt(id) },
      data: {
        title,
        details,
        dueDate: new Date(dueDate),
        target,
        repeat,
        isDone,
      },
    });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถแก้ไขแจ้งเตือนได้', error });
  }
};

export const deleteReminder = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reminder.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'ลบแจ้งเตือนเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถลบแจ้งเตือนได้', error });
  }
};

export const createCustomReminder = async (req, res) => {
  const { title, details, dueDate, repeat, target } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ message: 'กรุณาระบุหัวข้อและวันที่แจ้งเตือน' });
  }

  try {
    const reminder = await prisma.reminder.create({
      data: {
        title,
        details,
        dueDate: new Date(dueDate),
        repeat: repeat || null,
        target: target || 'ALL',
        type: 'CUSTOM',
      },
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเพิ่มแจ้งเตือน:', error);
    res.status(500).json({ message: 'ไม่สามารถเพิ่มแจ้งเตือนได้' });
  }
};
