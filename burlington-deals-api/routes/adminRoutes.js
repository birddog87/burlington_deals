// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

// Ensure routes are protected
router.use(authenticateToken);
router.use(authorizeAdmin);

/**
 * GET /api/admin/users
 * List all users
 */
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT user_id, email, display_name, role, is_active, created_at
      FROM users
      ORDER BY user_id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/admin/users/:id/role
 * Change a user's role
 * Body: { role: 'admin' | 'user' }
 */
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // e.g., { "role": "admin" }

    if (!role) {
      return res.status(400).json({ error: 'Role is required.' });
    }

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const result = await pool.query(`
      UPDATE users
      SET role = $1
      WHERE user_id = $2
      RETURNING user_id, email, role;
    `, [role, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error changing user role:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/admin/users/:id/deactivate
 * Toggle user's active status
 */
router.put('/users/:id/deactivate', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if is_active column exists
    const userCheck = await pool.query('SELECT is_active FROM users WHERE user_id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const currentStatus = userCheck.rows[0].is_active;

    const result = await pool.query(`
      UPDATE users
      SET is_active = $1
      WHERE user_id = $2
      RETURNING user_id, email, is_active;
    `, [!currentStatus, id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error toggling user active:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
