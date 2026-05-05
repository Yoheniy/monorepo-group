const { prisma } = require('../prisma-client');

// =============================
// CREATE POLL
// =============================
const createPoll = async (req, res) => {
  try {
    const { tournamentId, question, type, matchId, startsAt, endsAt } = req.body;

    if (!tournamentId || !question || !type || !startsAt || !endsAt) {
      return res.status(400).json({ error: 'tournamentId, question, type, startsAt, and endsAt are required' });
    }

    const poll = await prisma.poll.create({
      data: {
        tournamentId,
        question,
        type,
        matchId: matchId || null,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt)
      }
    });

    res.status(201).json({ success: true, poll });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

// =============================
// GET POLLS
// =============================
const getPolls = async (req, res) => {
  try {
    const { tournamentId } = req.query;
    const where = tournamentId ? { tournamentId } : {};

    const polls = await prisma.poll.findMany({
      where,
      include: { options: true, votes: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, polls });
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
};

module.exports = {
  createPoll,
  getPolls
};
