const express = require('express');
const router = express.Router();

const {
  createPoll,
  getPolls
} = require('../controllers/poll');

// CREATE POLL
router.post('/', createPoll);

// GET ALL POLLS (optionally by tournamentId)
router.get('/', getPolls);

module.exports = router;
