const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team');
const { protect, admin, coachOrAdmin } = require('../middleware/auth');

// Public routes
router.get('/', teamController.getTeams);
router.get('/:id', teamController.getTeamById);

// Protected routes (admin/coach only)
router.post('/', protect, coachOrAdmin, teamController.createTeam);
router.put('/:id', protect, coachOrAdmin, teamController.updateTeam);
router.delete('/:id', protect, admin, teamController.deleteTeam);

module.exports = router;