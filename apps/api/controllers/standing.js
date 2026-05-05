const { prisma } = require('../prisma-client');

// =============================
// GET Standings
// =============================
const getStandings = async (req, res) => {
  try {
    const { tournamentId } = req.query;

    if (!tournamentId) {
      return res.status(400).json({ error: 'tournamentId is required' });
    }

    const standings = await prisma.standing.findMany({
      where: { tournamentId },
      include: {
        team: true,          // include team info
        tournament: true     // include tournament info
      },
      orderBy: { position: 'asc' }  // sorted by position
    });

    res.json({ success: true, standings });
  } catch (error) {
    console.error('Get standings error:', error);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
};

// =============================
// UPDATE Standing
// =============================
const updateStanding = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body; // Expect fields like played, won, drawn, lost, gf, ga, points, gd, form

    const standing = await prisma.standing.update({
      where: { id },
      data
    });

    res.json({ success: true, standing });
  } catch (error) {
    console.error('Update standing error:', error);
    res.status(500).json({ error: 'Failed to update standing' });
  }
};

// =============================
// INITIALIZE Standings
// Automatically create standings for a team when added to a tournament
// =============================
const initializeStandingForTeam = async (teamId, tournamentId) => {
  try {
    // Check if standing already exists
    const existing = await prisma.standing.findUnique({
      where: { tournamentId_teamId: { tournamentId, teamId } }
    });

    if (existing) return existing;

    // Create new standing
    const standing = await prisma.standing.create({
      data: {
        tournamentId,
        teamId,
        position: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
        form: ''
      }
    });

    return standing;
  } catch (error) {
    console.error('Initialize standing error:', error);
    throw new Error('Failed to initialize standing');
  }
};

module.exports = {
  getStandings,
  updateStanding,
  initializeStandingForTeam
};
