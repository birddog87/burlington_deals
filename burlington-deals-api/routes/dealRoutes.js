// routes/dealRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

/**
 * GET /api/deals/approved
 * Fetch approved deals (public)
 */
router.get('/approved', async (req, res) => {
  try {
    const sql = `
      SELECT
        d.deal_id,
        d.restaurant_id,
        d.title,
        d.description,
        d.price,
        d.day_of_week,
        d.category,
        d.deal_type,
        d.is_approved,
        d.is_promoted,
        d.promoted_until,
        d.flat_price,
        d.percentage_discount,
        r.name AS restaurant_name,
        r.address,
        r.city,
        r.place_id,
        r.geometry_location_lat,
        r.geometry_location_lng,
        r.website,
        r.rating,
        r.user_ratings_total,
        d.created_at,
        d.updated_at,
        d.start_time,
        d.end_time,
        d.second_category,
        d.price_per_wing,
        d.promotion_tier
      FROM deals d
      INNER JOIN restaurants r ON d.restaurant_id = r.restaurant_id
      WHERE d.is_approved = true
      ORDER BY d.promotion_tier DESC, d.is_promoted DESC, d.created_at DESC;
    `;
    const result = await pool.query(sql);
    
    // Log first result for debugging
    if (result.rows.length > 0) {
      console.log('First deal data from database:', JSON.stringify({
        deal_id: result.rows[0].deal_id,
        restaurant_id: result.rows[0].restaurant_id,
        website: result.rows[0].website,
        rating: result.rows[0].rating
      }));
    }
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /approved route:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/deals
 * Fetch all deals (admin only)
 */
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT
        d.deal_id,
        d.restaurant_id,
        d.title,
        d.description,
        d.price,
        d.day_of_week,
        d.category,
        d.deal_type,
        d.is_approved,
        d.is_promoted,
        d.promoted_until,
        d.flat_price,
        d.percentage_discount,
        r.name AS restaurant_name,
        r.address AS address,
        r.place_id,
        d.created_at,
        d.updated_at,
        d.start_time,
        d.end_time,
        d.second_category,
        d.price_per_wing,
        d.promotion_tier
      FROM deals d
      INNER JOIN restaurants r ON d.restaurant_id = r.restaurant_id
      ORDER BY d.promotion_tier DESC, d.is_promoted DESC, d.created_at DESC;
    `;
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/deals
 * Create a new deal (any authenticated user)
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      day_of_week,
      category,
      restaurant_id,
      start_time,
      end_time,
      second_category,
      price_per_wing,
      deal_type,
      percentage_discount
    } = req.body;

    // Basic validation
    if (
      !title ||
      !description ||
      !price ||
      !day_of_week ||
      !category ||
      !restaurant_id ||
      !deal_type
    ) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const validDealTypes = ['flat', 'percentage', 'event'];
    if (!validDealTypes.includes(deal_type)) {
      return res
        .status(400)
        .json({ error: `Invalid deal_type. Must be one of: ${validDealTypes.join(', ')}` });
    }

    let flat_price = null;
    let percentage_discount_value = null;

    if (deal_type === 'flat') {
      flat_price = parseFloat(price);
      if (isNaN(flat_price) || flat_price < 0) {
        return res.status(400).json({ error: 'Invalid price for flat deal.' });
      }
    } else if (deal_type === 'percentage') {
      if (percentage_discount == null) {
        return res
          .status(400)
          .json({ error: 'percentage_discount is required for percentage deals.' });
      }
      percentage_discount_value = parseFloat(percentage_discount);
      if (
        isNaN(percentage_discount_value) ||
        percentage_discount_value <= 0 ||
        percentage_discount_value > 100
      ) {
        return res
          .status(400)
          .json({ error: 'Invalid percentage_discount. Must be between 0 and 100.' });
      }
    } else if (deal_type === 'event') {
      flat_price = null;
      percentage_discount_value = null;
    }

    const sql = `
      INSERT INTO deals (
        title,
        description,
        price,
        day_of_week,
        category,
        second_category,
        restaurant_id,
        start_time,
        end_time,
        is_approved,
        created_at,
        updated_at,
        price_per_wing,
        deal_type,
        flat_price,
        percentage_discount,
        promotion_tier
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, NOW(), NOW(), $10, $11, $12, $13, 0)
      RETURNING *;
    `;
    const values = [
      title,
      description,
      price,
      day_of_week,
      category,
      second_category || null,
      restaurant_id,
      start_time || null,
      end_time || null,
      price_per_wing || null,
      deal_type,
      flat_price,
      percentage_discount_value
    ];

    const result = await pool.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/deals/:id
 * Update a deal (admin only)
 */
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    const allowedFields = [
      'title',
      'description',
      'price',
      'day_of_week',
      'category',
      'second_category',
      'start_time',
      'end_time',
      'is_promoted',
      'promoted_until',
      'is_approved',
      'price_per_wing',
      'deal_type',
      'percentage_discount',
      'promotion_tier'
    ];
    const invalidFields = Object.keys(updatedData).filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    // If deal_type is being updated, validate
    if (updatedData.deal_type) {
      const validDealTypes = ['flat', 'percentage', 'event'];
      if (!validDealTypes.includes(updatedData.deal_type)) {
        return res
          .status(400)
          .json({ error: `Invalid deal_type. Must be one of: ${validDealTypes.join(', ')}` });
      }
    }

    // Price logic
    if (updatedData.deal_type) {
      if (updatedData.deal_type === 'flat') {
        updatedData.percentage_discount = null;
        if (updatedData.price != null) {
          const flat_price = parseFloat(updatedData.price);
          if (isNaN(flat_price) || flat_price < 0) {
            return res.status(400).json({ error: 'Invalid price for flat deal.' });
          }
          updatedData.flat_price = flat_price;
        }
      } else if (updatedData.deal_type === 'percentage') {
        updatedData.flat_price = null;
        if (updatedData.percentage_discount != null) {
          const percentage_discount_value = parseFloat(updatedData.percentage_discount);
          if (
            isNaN(percentage_discount_value) ||
            percentage_discount_value <= 0 ||
            percentage_discount_value > 100
          ) {
            return res
              .status(400)
              .json({ error: 'Invalid percentage_discount. Must be 0-100.' });
          }
          updatedData.percentage_discount = percentage_discount_value;
        }
      } else if (updatedData.deal_type === 'event') {
        updatedData.price = 0.0;
        updatedData.flat_price = null;
        updatedData.percentage_discount = null;
      }
    }

    // Build the SET clause dynamically
    const setClause = Object.keys(updatedData)
      .map((field, idx) => `${field} = $${idx + 1}`)
      .join(', ');
    const values = Object.values(updatedData);

    const sql = `
      UPDATE deals
      SET ${setClause}, updated_at = NOW()
      WHERE deal_id = $${values.length + 1}
      RETURNING *;
    `;
    values.push(id);

    const result = await pool.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * DELETE /api/deals/:id
 * Delete a deal (admin only)
 */
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the deal exists
    const dealCheck = await pool.query('SELECT * FROM deals WHERE deal_id = $1', [id]);
    if (dealCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found.' });
    }

    // Delete
    await pool.query('DELETE FROM deals WHERE deal_id = $1', [id]);

    res.status(200).json({ message: 'Deal deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/deals/:id/promote
 * Simply sets is_promoted=true and promoted_until
 */
router.put('/:id/promote', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { promoted_until } = req.body;

    if (!promoted_until) {
      return res.status(400).json({ error: 'Missing promoted_until field.' });
    }
    const promotedUntilDate = new Date(promoted_until);
    if (isNaN(promotedUntilDate.getTime())) {
      return res.status(400).json({ error: 'Invalid promoted_until date.' });
    }

    const sql = `
      UPDATE deals
      SET is_promoted = true,
          promoted_until = $1,
          updated_at = NOW()
      WHERE deal_id = $2
      RETURNING *;
    `;
    const result = await pool.query(sql, [promoted_until, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/deals/:id/unfeature
 */
router.put('/:id/unfeature', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE deals
      SET is_promoted = false,
          promoted_until = null,
          updated_at = NOW()
      WHERE deal_id = $1
      RETURNING *;
    `;
    const result = await pool.query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/deals/:id/approve
 */
router.put('/:id/approve', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE deals
      SET is_approved = true,
          updated_at = NOW()
      WHERE deal_id = $1
      RETURNING *;
    `;
    const result = await pool.query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/deals/:id/reject
 */
router.put('/:id/reject', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE deals
      SET is_approved = false,
          updated_at = NOW()
      WHERE deal_id = $1
      RETURNING *;
    `;
    const result = await pool.query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/deals/:id/setPromotionTier
 * Set an integer tier (0,1,2,3, etc.)
 */
router.put('/:id/setPromotionTier', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { promotion_tier } = req.body;

    if (typeof promotion_tier !== 'number') {
      return res.status(400).json({ error: 'Invalid promotion_tier, must be a number.' });
    }

    const sql = `
      UPDATE deals
      SET promotion_tier = $1, updated_at = NOW()
      WHERE deal_id = $2
      RETURNING *;
    `;
    const result = await pool.query(sql, [promotion_tier, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
