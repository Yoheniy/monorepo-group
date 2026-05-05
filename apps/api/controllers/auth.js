const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../prisma-client');

// =============================
// HELPERS
// =============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// =============================
// REGISTER
// =============================
const register = async (req, res) => {
  try {
    const { email, password, fullName, phone, department, studentId, batch } = req.body;

    const idFront = req.files?.idFront?.[0]?.path || null;
    const idBack = req.files?.idBack?.[0]?.path || null;

    if (!email || !password || !fullName || !department || !studentId || !idFront || !idBack) {
      return res.status(400).json({ error: 'All fields and ID images are required' });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { studentId }] }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email
          ? 'Email already exists'
          : 'Student ID already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone: phone || null,
        department,
        studentId,
        batch: batch || null,
        idFront,
        idBack,
        role: 'PLAYER',
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Waiting for admin approval.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// =============================
// LOGIN
// =============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Allow PENDING users to login; only block REJECTED accounts
    if (user.status === 'REJECTED') {
      return res.status(403).json({ error: 'Account rejected' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

// =============================
// LOGOUT
// =============================
const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// =============================
// PROFILE
// =============================
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, user });
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// =============================
// ADMIN
// =============================
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, users });
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: 'PENDING' }
    });
    res.json({ success: true, users });
  } catch {
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
};

const approveUser = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedById: req.user.id,
        approvedAt: new Date()
      }
    });
    res.json({ success: true, message: 'User approved' });
  } catch {
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

const rejectUser = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date()
      }
    });
    res.json({ success: true, message: 'User rejected' });
  } catch {
    res.status(500).json({ error: 'Failed to reject user' });
  }
};

// =============================
// ✅ UPDATE USER (EDIT BUTTON)
// =============================
const updateUser = async (req, res) => {
  try {
    const { role, department, status } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(role && { role }),
        ...(department && { department }),
        ...(status && { status })
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// =============================
// =============================
// ❌ DELETE USER
// =============================
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// EXPORTS
// =============================
module.exports = {
  deleteUser,
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  updateUser // ✅ IMPORTANT
};
