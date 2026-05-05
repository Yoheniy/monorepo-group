// controllers/team.js
const { prisma } = require('../prisma-client');
const { initializeStandingForTeam } = require('./standing');

// =============================
// CREATE TEAM
// =============================
const createTeam = async (req, res) => {
  try {
    const { name, shortName, department, color, logo, coachId, tournamentId } = req.body;

    if (!name || !department || !tournamentId) {
      return res.status(400).json({ error: 'Name, department, and tournamentId are required' });
    }

    // Check if team already exists in this tournament
    const existingTeam = await prisma.team.findFirst({
      where: { name, tournamentId }
    });
    if (existingTeam) {
      return res.status(400).json({ error: 'A team with this name already exists in this tournament' });
    }

    const team = await prisma.team.create({
      data: {
        name,
        shortName: shortName || name.slice(0, 3).toUpperCase(),
        department,
        color: color || '#7C3AED',
        logo: logo || null,
        tournamentId
      }
    });

    // Create coach participant if provided
    if (coachId) {
      await prisma.teamParticipant.upsert({
        where: { coachedTeamId: team.id },
        update: { userId: coachId },
        create: {
          userId: coachId,
          teamId: team.id,
          tournamentId,
          jerseyNumber: null,
          position: null,
          coachedTeamId: team.id
        }
      });
    }

    // Initialize standing for this team in the tournament
    await initializeStandingForTeam(team.id, tournamentId);

    res.status(201).json({ success: true, team });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

// =============================
// GET TEAMS
// =============================
const getTeams = async (req, res) => {
  try {
    const { tournamentId } = req.query;

    const where = {};
    if (tournamentId) where.tournamentId = tournamentId;

    const teams = await prisma.team.findMany({
      where,
      include: {
        tournament: { select: { id: true, name: true, season: true } },
        coach: { include: { user: { select: { id: true, fullName: true, email: true } } } },
        participants: { include: { user: { select: { id: true, fullName: true, email: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, teams });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// =============================
// GET TEAM BY ID
// =============================
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        tournament: true,
        coach: { include: { user: true } },
        participants: { include: { user: true } },
        homeMatches: true,
        awayMatches: true
      }
    });

    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

// =============================
// UPDATE TEAM
// =============================
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortName, department, color, logo, coachId } = req.body;

    const team = await prisma.team.update({
      where: { id },
      data: { name, shortName, department, color, logo }
    });

    // Update or create coach participant
    if (coachId) {
      await prisma.teamParticipant.upsert({
        where: { coachedTeamId: id },
        update: { userId: coachId },
        create: {
          userId: coachId,
          teamId: id,
          tournamentId: team.tournamentId,
          jerseyNumber: null,
          position: null,
          coachedTeamId: id
        }
      });
    }

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
};

// =============================
// DELETE TEAM
// =============================
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.team.delete({ where: { id } });

    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};
