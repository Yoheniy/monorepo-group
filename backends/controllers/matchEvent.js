const { prisma } = require('../prisma-client');

// =============================
// CREATE MATCH EVENT
// =============================
const createMatchEvent = async (req, res) => {
  try {
    const { matchId, minute, type, playerId, description } = req.body;

    if (!matchId || minute == null || !type) {
      return res.status(400).json({ error: 'matchId, minute, and type are required' });
    }

    const event = await prisma.matchEvent.create({
      data: { matchId, minute, type, playerId: playerId || null, description: description || null },
      include: { match: true }
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Create match event error:', error);
    res.status(500).json({ error: 'Failed to create match event' });
  }
};

// =============================
// GET MATCH EVENTS
// =============================
const getMatchEvents = async (req, res) => {
  try {
    const { matchId } = req.query;
    const where = {};
    if (matchId) where.matchId = matchId;

    const events = await prisma.matchEvent.findMany({ where, orderBy: { minute: 'asc' } });

    res.json({ success: true, events });
  } catch (error) {
    console.error('Get match events error:', error);
    res.status(500).json({ error: 'Failed to fetch match events' });
  }
};

// =============================
// DELETE MATCH EVENT
// =============================
const deleteMatchEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.matchEvent.delete({ where: { id } });
    res.json({ success: true, message: 'Match event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete match event' });
  }
};

module.exports = { createMatchEvent, getMatchEvents, deleteMatchEvent };
