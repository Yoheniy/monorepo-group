const { prisma } = require('../prisma-client');

// =============================
// CREATE MATCH
// =============================
const createMatch = async (req, res) => {
  try {
    const { tournamentId, homeTeamId, awayTeamId, date, time, venue, matchweek } = req.body;

    if (!tournamentId || !homeTeamId || !awayTeamId || !date) {
      return res.status(400).json({ error: 'tournamentId, homeTeamId, awayTeamId, and date are required' });
    }

    const match = await prisma.match.create({
      data: {
        tournamentId,
        homeTeamId,
        awayTeamId,
        date: new Date(date),
        time: time || null,
        venue: venue || 'Main Stadium',
        matchweek: matchweek || null
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true
      }
    });

    res.status(201).json({ success: true, match });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
};

// =============================
// GET MATCHES
// =============================
const getMatches = async (req, res) => {
  try {
    const { tournamentId } = req.query;

    const where = {};
    if (tournamentId) where.tournamentId = tournamentId;

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        events: true,
        injuries: true
      },
      orderBy: { date: 'asc' }
    });

    res.json({ success: true, matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

// =============================
// GET MATCH BY ID
// =============================
const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
        events: true,
        injuries: true
      }
    });

    if (!match) return res.status(404).json({ error: 'Match not found' });

    res.json({ success: true, match });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match' });
  }
};

// =============================
// UPDATE MATCH
// =============================
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const match = await prisma.match.update({
      where: { id },
      data,
      include: { homeTeam: true, awayTeam: true, tournament: true }
    });

    res.json({ success: true, match });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({ error: 'Failed to update match' });
  }
};

// =============================
// DELETE MATCH
// =============================
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.match.delete({ where: { id } });

    res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete match' });
  }
};

module.exports = { createMatch, getMatches, getMatchById, updateMatch, deleteMatch };
