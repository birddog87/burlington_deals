// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// Checks for token, verifies it, fetches user from DB
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // authHeader is like "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;

    // fetch user from DB
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: 'User not found' });
    }

    req.user = userResult.rows[0]; 
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Only admin users
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
};

module.exports = { authenticateToken, authorizeAdmin };
