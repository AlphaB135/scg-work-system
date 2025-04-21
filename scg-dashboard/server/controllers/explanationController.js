import prisma from '../prismaClient.js';

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
