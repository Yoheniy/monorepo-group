const { prisma } = require('../prisma-client');

// =============================
// CREATE INJURY
// =============================
const createInjury = async (req, res) => {
  try {
    const { participantId, matchId, injuryType, severity, expectedRecovery, notes } = req.body;

    if (!participantId || !injuryType || !severity) {
      return res.status(400).json({ error: 'participantId, injuryType, and severity are required' });
    }

    const injury = await prisma.injury.create({
      data: {
        participantId,
        matchId: matchId || null,
        injuryType,
        severity,
        expectedRecovery: expectedRecovery || null,
        notes: notes || null
      },
      include: { participant: true, match: true }
    });

    res.status(201).json({ success: true, injury });
  } catch (error) {
    console.error('Create injury error:', error);
    res.status(500).json({ error: 'Failed to create injury' });
  }
};

// =============================
// GET INJURIES
// =============================
const getInjuries = async (req, res) => {
  try {
    const { matchId, participantId } = req.query;
    const where = {};
    if (matchId) where.matchId = matchId;
    if (participantId) where.participantId = participantId;

    const injuries = await prisma.injury.findMany({ where, include: { participant: true, match: true } });

    res.json({ success: true, injuries });
  } catch (error) {
    console.error('Get injuries error:', error);
    res.status(500).json({ error: 'Failed to fetch injuries' });
  }
};

// =============================
// UPDATE INJURY
// =============================
const updateInjury = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const injury = await prisma.injury.update({
      where: { id },
      data,
      include: { participant: true, match: true }
    });

    res.json({ success: true, injury });
  } catch (error) {
    console.error('Update injury error:', error);
    res.status(500).json({ error: 'Failed to update injury' });
  }
};

// =============================
// DELETE INJURY
// =============================
const deleteInjury = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.injury.delete({ where: { id } });
    res.json({ success: true, message: 'Injury deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete injury' });
  }
};

module.exports = { createInjury, getInjuries, updateInjury, deleteInjury };
