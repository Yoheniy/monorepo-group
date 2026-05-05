const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/multer');

// =============================
// AUTH
// =============================

// REGISTER
router.post(
  '/register',
  upload.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 }
  ]),
  authController.register
);

// LOGIN
router.post('/login', authController.login);

// LOGOUT
router.post('/logout', authController.logout);

// =============================
// USER
// =============================

// PROFILE
router.get('/profile', protect, authController.getProfile);

// =============================
// ADMIN
// =============================

// ALL USERS
router.get('/users', protect, admin, authController.getAllUsers);

// PENDING USERS
router.get('/users/pending', protect, admin, authController.getPendingUsers);

// APPROVE
router.put('/users/:id/approve', protect, admin, authController.approveUser);

// REJECT
router.put('/users/:id/reject', protect, admin, authController.rejectUser);

// ✅ EDIT USER (ROLE / DEPARTMENT / STATUS)
router.put('/users/:id', protect, admin, authController.updateUser);

// ❌ DELETE USER
router.delete('/users/:id', protect, admin, authController.deleteUser);


module.exports = router;
