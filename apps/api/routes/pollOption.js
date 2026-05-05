const express = require('express');
const router = express.Router();

const {
  createPollOption,
  getPollOptions
} = require('../controllers/pollOption');

// CREATE POLL OPTION
router.post('/', createPollOption);

// GET OPTIONS BY POLL ID
router.get('/:pollId', getPollOptions);

module.exports = router;
