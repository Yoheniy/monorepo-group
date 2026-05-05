const { prisma } = require('../prisma-client');

/**
 * Helper: Get next available jersey number for a team
 */
const getNextJerseyNumber = async (teamId) => {
  const jerseys = await prisma.teamParticipant.findMany({
    where: {
      teamId,
      jerseyNumber: { not: null },
    },
    select: { jerseyNumber: true },
    orderBy: { jerseyNumber: 'asc' },
  });

  const used = jerseys.map(j => j.jerseyNumber);

  let number = 1;
  while (used.includes(number)) {
    number++;
  }

  return number;
};

/**
 * GET participants
 * ?teamId=
 * ?tournamentId=
 */
const getParticipants = async (req, res) => {
  try {
    const { teamId, tournamentId } = req.query;

    const where = {};
    if (teamId) where.teamId = teamId;
    if (tournamentId) where.tournamentId = tournamentId;

    const participants = await prisma.teamParticipant.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        team: true,
        tournament: true,
      },
      orderBy: {
        jerseyNumber: 'asc',
      },
    });

    res.json({ success: true, participants });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch participants' });
  }
};

/**
 * ADD participant
 */
const addParticipant = async (req, res) => {
  try {
    const {
      userId,
      teamId,
      tournamentId,
      jerseyNumber,
      position, // GK | DEF | MID | FWD
      isCoach = false,
    } = req.body;

    // Basic validation
    if (!userId || !teamId || !tournamentId) {
      return res.status(400).json({
        success: false,
        message: 'userId, teamId, and tournamentId are required',
      });
    }

    // Prevent duplicate participant per tournament
    const existingParticipant = await prisma.teamParticipant.findUnique({
      where: {
        userId_tournamentId: {
          userId,
          tournamentId,
        },
      },
    });

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered in this tournament',
      });
    }

    // Enforce max players per team
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { maxPlayers: true },
    });

    const teamPlayerCount = await prisma.teamParticipant.count({
      where: { teamId, tournamentId },
    });

    if (teamPlayerCount >= tournament.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: 'Team has reached maximum number of players',
      });
    }

    // Auto assign jersey number if missing
    let finalJerseyNumber = jerseyNumber;
    if (!finalJerseyNumber) {
      finalJerseyNumber = await getNextJerseyNumber(teamId);
    }

    // Enforce single coach per team
    let coachedTeamId = null;
    if (isCoach) {
      const existingCoach = await prisma.teamParticipant.findFirst({
        where: {
          coachedTeamId: teamId,
        },
      });

      if (existingCoach) {
        return res.status(400).json({
          success: false,
          message: 'This team already has a coach',
        });
      }

      coachedTeamId = teamId;
    }

    // Create participant
    const participant = await prisma.teamParticipant.create({
      data: {
        userId,
        teamId,
        tournamentId,
        jerseyNumber: finalJerseyNumber,
        position: position || null,
        coachedTeamId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Participant added successfully',
      participant,
    });
  } catch (error) {
    console.error('Add participant error:', error);

    // Prisma unique constraint error (jersey number clash)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Jersey number already taken for this team',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add participant',
    });
  }
};

/**
 * UPDATE participant
 */
const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { jerseyNumber, position } = req.body;

    const participant = await prisma.teamParticipant.update({
      where: { id },
      data: {
        jerseyNumber,
        position,
      },
    });

    res.json({
      success: true,
      message: 'Participant updated successfully',
      participant,
    });
  } catch (error) {
    console.error('Update participant error:', error);
    res.status(500).json({ success: false, message: 'Failed to update participant' });
  }
};

/**
 * REMOVE participant
 */
const removeParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.teamParticipant.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Participant removed successfully',
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove participant' });
  }
};

module.exports = {
  getParticipants,
  addParticipant,
  updateParticipant,
  removeParticipant,
};
