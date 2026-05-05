const express = require('express');
const router = express.Router();
const {
  createMatchEvent,
  getMatchEvents,
  deleteMatchEvent
} = require('../controllers/matchEvent');

// Create a match event
router.post('/', createMatchEvent);

// Get all match events (optionally filter by matchId)
router.get('/', getMatchEvents);

// Delete match event
router.delete('/:id', deleteMatchEvent);

module.exports = router;
