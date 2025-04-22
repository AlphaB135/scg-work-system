import prisma from '../../prisma/prismaClient.js'

export const submitExplanation = async (req, res) => {
  try {
    const { date, explanation } = req.body;
    const userId = req.user?.id;

    if (!date || !explanation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedDate = new Date(date);

    await prisma.explanation.create({
      data: {
        employeeId: userId,
        date: parsedDate,
        explanation,
        status: 'PENDING',
      },
    });

    res.json({ message: 'Explanation submitted successfully' });
  } catch (err) {
    console.error('Error submitting explanation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateExplanationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updated = await prisma.explanation.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: 'Status updated', explanation: updated });
  } catch (err) {
    console.error('Error updating explanation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPendingExplanations = async (req, res) => {
  try {
    const list = await prisma.explanation.findMany({
      where: { status: 'PENDING' },
      include: {
        employee: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(list);
  } catch (err) {
    console.error('Error loading explanations:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
};
