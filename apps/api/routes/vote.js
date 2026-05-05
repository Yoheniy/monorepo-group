const express = require('express');
const router = express.Router();

const {
  createVote,
  getVotesByPoll
} = require('../controllers/vote');

// CAST VOTE
router.post('/', createVote);

// GET RESULTS BY POLL
router.get('/:pollId', getVotesByPoll);

module.exports = router;
