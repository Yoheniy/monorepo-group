// middleware/auth.js
const jwt = require('jsonwebtoken');
const { prisma } = require('../prisma-client');

const protect = async (req, res, next) => {
  try {
    // Get token from cookie or header
    let token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Allow users who are PENDING to use general features
    // Only explicitly block REJECTED users
    if (user.status === 'REJECTED') {
      return res.status(403).json({ error: 'Account rejected' });
    }

    if (user.status === 'PENDING') {
      console.warn(`Pending user access: ${user.email}`);
      // attach pending flag so handlers (if needed) can treat specially
      user.isPending = true;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as admin' });
  }
};

const coachOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'COACH')) {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized' });
  }
};

module.exports = { protect, admin, coachOrAdmin };