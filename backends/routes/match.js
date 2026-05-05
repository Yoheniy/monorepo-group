const express = require('express');
const router = express.Router();
const {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  deleteMatch
} = require('../controllers/match');

// Create a match
router.post('/', createMatch);

// Get all matches (optionally filter by tournamentId)
router.get('/', getMatches);

// Get match by ID
router.get('/:id', getMatchById);

// Update match
router.put('/:id', updateMatch);

// Delete match
router.delete('/:id', deleteMatch);

module.exports = router;
