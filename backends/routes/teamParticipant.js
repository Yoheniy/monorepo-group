const express = require('express');
const router = express.Router();

const participantController = require('../controllers/teamParticipant');
const { protect, admin, coachOrAdmin } = require('../middleware/auth');

// Public routes (read-only)
router.get('/', participantController.getParticipants);

// Protected routes
router.post('/', protect, coachOrAdmin, participantController.addParticipant);
router.put('/:id', protect, coachOrAdmin, participantController.updateParticipant);
router.delete('/:id', protect, admin, participantController.removeParticipant);

module.exports = router;
