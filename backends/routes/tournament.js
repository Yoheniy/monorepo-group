const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournament');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', tournamentController.getTournaments);
router.get('/:id', tournamentController.getTournamentById);

// Admin only routes
router.post('/', protect, admin, tournamentController.createTournament);
router.put('/:id', protect, admin, tournamentController.updateTournament);
router.delete('/:id', protect, admin, tournamentController.deleteTournament);

module.exports = router;