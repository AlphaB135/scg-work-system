const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// API สำหรับบันทึกคำชี้แจง
router.post('/submit-explanation', async (req, res) => {
  const { date, explanation } = req.body;

  try {
    // บันทึกคำชี้แจง
    const newExplanation = await prisma.explanation.create({
      data: {
        date,
        explanation,
        // ปรับตามโครงสร้างของฐานข้อมูล
      },
    });
    
    res.status(200).json({ message: 'คำชี้แจงถูกส่งแล้ว', data: newExplanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกคำชี้แจง' });
  }
});

module.exports = router;
