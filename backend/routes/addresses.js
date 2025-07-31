const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user's addresses
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, type, label, street_address, city, state, postal_code, 
             country, phone, is_default, created_at
      FROM addresses 
      WHERE user_id = $1 
      ORDER BY is_default DESC, created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      addresses: result.rows
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Server error fetching addresses' });
  }
});

// Create new address
router.post('/', verifyToken, [
  body('type').isIn(['shipping', 'billing']).withMessage('Type must be shipping or billing'),
  body('label').optional().trim().isLength({ max: 100 }),
  body('streetAddress').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').optional().trim(),
  body('postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('country').optional().trim(),
  body('phone').optional().trim(),
  body('isDefault').optional().isBoolean(),
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type,
      label,
      streetAddress,
      city,
      state,
      postalCode,
      country = 'Nepal',
      phone,
      isDefault = false
    } = req.body;

    // If this is set as default, remove default from other addresses of same type
    if (isDefault) {
      await client.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND type = $2',
        [req.user.id, type]
      );
    }

    // Create new address
    const result = await client.query(`
      INSERT INTO addresses (
        user_id, type, label, street_address, city, state, 
        postal_code, country, phone, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      req.user.id, type, label, streetAddress, city, state,
      postalCode, country, phone, isDefault
    ]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Server error creating address' });
  } finally {
    client.release();
  }
});

// Update address
router.put('/:id', verifyToken, [
  body('type').optional().isIn(['shipping', 'billing']),
  body('label').optional().trim().isLength({ max: 100 }),
  body('streetAddress').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('state').optional().trim(),
  body('postalCode').optional().trim().notEmpty(),
  body('country').optional().trim(),
  body('phone').optional().trim(),
  body('isDefault').optional().isBoolean(),
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Check if address belongs to user
    const addressCheck = await client.query(
      'SELECT type FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (addressCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Address not found' });
    }

    const addressType = addressCheck.rows[0].type;

    // Build dynamic update query
    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = key === 'streetAddress' ? 'street_address' :
                       key === 'postalCode' ? 'postal_code' :
                       key === 'isDefault' ? 'is_default' :
                       key.replace(/([A-Z])/g, '_$1').toLowerCase();
        
        updates.push(`${dbField} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No fields to update' });
    }

    // If setting as default, remove default from other addresses of same type
    if (req.body.isDefault === true) {
      await client.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND type = $2 AND id != $3',
        [req.user.id, addressType, id]
      );
    }

    values.push(id, req.user.id);

    const query = `
      UPDATE addresses 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
      RETURNING *
    `;

    const result = await client.query(query, values);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Address updated successfully',
      address: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Server error updating address' });
  } finally {
    client.release();
  }
});

// Delete address
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING type, label',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({
      success: true,
      message: `Address "${result.rows[0].label || result.rows[0].type}" deleted successfully`
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Server error deleting address' });
  }
});

// Set address as default
router.put('/:id/set-default', verifyToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;

    // Get address type
    const addressResult = await client.query(
      'SELECT type FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (addressResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Address not found' });
    }

    const addressType = addressResult.rows[0].type;

    // Remove default from other addresses of same type
    await client.query(
      'UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND type = $2',
      [req.user.id, addressType]
    );

    // Set this address as default
    const result = await client.query(
      'UPDATE addresses SET is_default = TRUE WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Default address updated successfully',
      address: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Server error setting default address' });
  } finally {
    client.release();
  }
});

module.exports = router;
