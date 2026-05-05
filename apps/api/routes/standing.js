const express = require('express');
const router = express.Router();
const standingController = require('../controllers/standing');
const { protect, admin } = require('../middleware/auth');

// Public route
router.get('/', standingController.getStandings);

// Admin route
router.put('/:id', protect, admin, standingController.updateStanding);

module.exports = router;
