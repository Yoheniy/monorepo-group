// controllers/tournament.js
const { prisma } = require('../prisma-client');

const createTournament = async (req, res) => {
  try {
    const { name, season, startDate, endDate, sponsors, maxPlayers, teamIds } = req.body;

    if (!name || !season || !startDate) {
      return res.status(400).json({ error: 'Name, season, and start date are required' });
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        season,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        sponsors: sponsors || null,
        totalClubs: teamIds ? teamIds.length : 0,
        maxPlayers: maxPlayers || 18,
        isActive: true
      }
    });

    // Link teams to tournament if provided
    if (teamIds && teamIds.length > 0) {
      // Update teams with tournamentId
      await prisma.team.updateMany({
        where: { id: { in: teamIds } },
        data: { tournamentId: tournament.id }
      });

      // Create initial standings for each team
      for (const teamId of teamIds) {
        await prisma.standing.create({
          data: {
            tournamentId: tournament.id,
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
      }
    }

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      tournament
    });

  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
};

const getTournaments = async (req, res) => {
  try {
    const { active } = req.query;
    
    const where = {};
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logo: true,
            color: true,
            department: true
          }
        },
        matches: {
          take: 5,
          orderBy: { date: 'desc' },
          include: {
            homeTeam: true,
            awayTeam: true
          }
        },
        standings: {
          include: {
            team: true
          },
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, tournaments });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        teams: true,
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true,
            events: true
          }
        },
        standings: {
          include: {
            team: true
          },
          orderBy: { position: 'asc' }
        },
        polls: true
      }
    });
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    res.json({ success: true, tournament });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
};

const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, season, startDate, endDate, sponsors, maxPlayers, isActive } = req.body;
    
    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        name,
        season,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        sponsors,
        maxPlayers,
        isActive
      }
    });
    
    res.json({ success: true, tournament });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tournament' });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.tournament.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
};

module.exports = {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament
};