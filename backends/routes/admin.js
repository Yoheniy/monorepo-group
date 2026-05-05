// src/routes/admin.js
const express = require('express');
const { getAllUsers, getPendingUsers, approveUser, rejectUser } = require('../controllers/auth');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

// GET ALL USERS (with filter)
router.get('/users', getAllUsers);

// GET PENDING USERS
router.get('/users/pending', getPendingUsers);

// APPROVE USER
router.post('/users/approve/:id', approveUser);

// REJECT USER
router.post('/users/reject/:id', rejectUser);

module.exports = router;