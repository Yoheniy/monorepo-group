const { prisma } = require('../prisma-client');

// =============================
// CREATE POLL OPTION
// =============================
const createPollOption = async (req, res) => {
  try {
    const { pollId, title, playerId, image } = req.body;

    if (!pollId || !title) {
      return res.status(400).json({ error: 'pollId and title are required' });
    }

    const option = await prisma.pollOption.create({
      data: {
        pollId,
        title,
        playerId: playerId || null,
        image: image || null
      }
    });

    res.status(201).json({ success: true, option });
  } catch (error) {
    console.error('Create poll option error:', error);
    res.status(500).json({ error: 'Failed to create poll option' });
  }
};

// =============================
// GET POLL OPTIONS
// =============================
const getPollOptions = async (req, res) => {
  try {
    const { pollId } = req.params;
    if (!pollId) return res.status(400).json({ error: 'pollId is required' });

    const options = await prisma.pollOption.findMany({
      where: { pollId }
    });

    res.json({ success: true, options });
  } catch (error) {
    console.error('Get poll options error:', error);
    res.status(500).json({ error: 'Failed to fetch poll options' });
  }
};
module.exports = {
  createPollOption,
  getPollOptions
};
