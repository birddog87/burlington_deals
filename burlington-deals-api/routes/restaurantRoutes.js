// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

/**
 * Search restaurants (OPEN or user-only, up to you)
 * For example, let’s allow ANY user (even not logged in) to do /search:
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      // if user typed fewer than 2 chars, return empty
      return res.json([]);
    }
    const result = await pool.query(
      `
      SELECT restaurant_id, name
      FROM restaurants
      WHERE is_active = true
        AND name ILIKE $1
      ORDER BY name ASC
      LIMIT 15
      `,
      [`%${q}%`]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET all restaurants - you could allow all users to see them or just logged-in.
 * For demonstration, let's allow ANY user to see them:
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM restaurants
      WHERE is_active = true
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET single restaurant by ID - again, up to you if you want to lock down:
 */
router.get('/:restaurant_id', async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM restaurants WHERE restaurant_id = $1`,
      [restaurant_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching restaurant', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a new restaurant
 */
router.post('/', async (req, res) => {
  const { name, address, city, province } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO imported_restaurants 
      (name, address, city, province, status, created_at) 
      VALUES ($1, $2, $3, $4, 'pending', NOW()) 
      RETURNING *;
      `,
      [name, address, city, province]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating restaurant:', err);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
});

/**
 * Deactivate a restaurant (admin only):
 * Now we specifically protect just this route with authenticateToken+authorizeAdmin
 */
router.put('/:restaurant_id/deactivate', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const result = await pool.query(`
      UPDATE restaurants
      SET is_active = false
      WHERE restaurant_id = $1
      RETURNING *
    `, [restaurant_id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deactivating restaurant', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
