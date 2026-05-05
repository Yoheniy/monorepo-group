const { prisma } = require('../prisma-client');

// =============================
// CREATE VOTE
// =============================
const createVote = async (req, res) => {
  try {
    const { pollId, optionId, userId } = req.body;

    if (!pollId || !optionId || !userId) {
      return res.status(400).json({ error: 'pollId, optionId, and userId are required' });
    }

    const vote = await prisma.vote.create({
      data: { pollId, optionId, userId }
    });

    res.status(201).json({ success: true, vote });
  } catch (error) {
    console.error('Create vote error:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'User has already voted for this poll' });
    }

    res.status(500).json({ error: 'Failed to create vote' });
  }
};

// =============================
// GET VOTES BY POLL
// =============================
const getVotesByPoll = async (req, res) => {
    try {
      const { pollId } = req.params; // ✅ read from URL param
      if (!pollId) return res.status(400).json({ error: 'pollId is required' });
  
      const votes = await prisma.vote.findMany({
        where: { pollId },
        include: { user: true, option: true }
      });
  
      res.json({ success: true, votes });
    } catch (error) {
      console.error('Get votes error:', error);
      res.status(500).json({ error: 'Failed to fetch votes' });
    }
  };
  

module.exports = {
  createVote,
  getVotesByPoll
};
