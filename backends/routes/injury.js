const express = require('express');
const router = express.Router();
const {
  createInjury,
  getInjuries,
  updateInjury,
  deleteInjury
} = require('../controllers/injury');

// Create an injury
router.post('/', createInjury);

// Get injuries (optionally filter by matchId or participantId)
router.get('/', getInjuries);

// Update an injury
router.put('/:id', updateInjury);

// Delete an injury
router.delete('/:id', deleteInjury);

module.exports = router;
