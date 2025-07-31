const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit contact form (public endpoint)
router.post('/submit', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('subject').optional().trim(),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    const result = await pool.query(`
      INSERT INTO contact_messages (name, email, phone, subject, message) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, created_at
    `, [name, email, phone || null, subject || null, message]);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      messageId: result.rows[0].id
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ error: 'Server error sending message. Please try again.' });
  }
});

// Get all contact messages (Admin only)
router.get('/admin/messages', verifyToken, requireAdmin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['unread', 'read', 'replied']),
  query('search').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      status,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Add status filter
    if (status) {
      whereConditions.push(`status = $${paramIndex++}`);
      queryParams.push(status);
    }

    // Add search filter
    if (search) {
      whereConditions.push(`(
        name ILIKE $${paramIndex} OR 
        email ILIKE $${paramIndex} OR 
        subject ILIKE $${paramIndex} OR 
        message ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get messages with admin reply info
    const messagesQuery = `
      SELECT 
        cm.id, cm.name, cm.email, cm.phone, cm.subject, cm.message, 
        cm.status, cm.admin_reply, cm.replied_at, cm.created_at,
        u.name as replied_by_name
      FROM contact_messages cm
      LEFT JOIN users u ON cm.replied_by = u.id
      ${whereClause}
      ORDER BY 
        CASE WHEN cm.status = 'unread' THEN 0 ELSE 1 END,
        cm.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(parseInt(limit), offset);

    // Count total messages for pagination
    const countQuery = `
      SELECT COUNT(*)
      FROM contact_messages cm
      ${whereClause}
    `;

    const [messagesResult, countResult] = await Promise.all([
      pool.query(messagesQuery, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    const totalMessages = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      success: true,
      messages: messagesResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMessages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Server error fetching contact messages' });
  }
});

// Get single contact message (Admin only)
router.get('/admin/messages/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        cm.id, cm.name, cm.email, cm.phone, cm.subject, cm.message, 
        cm.status, cm.admin_reply, cm.replied_at, cm.created_at,
        u.name as replied_by_name, u.email as replied_by_email
      FROM contact_messages cm
      LEFT JOIN users u ON cm.replied_by = u.id
      WHERE cm.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    // Mark as read if unread
    if (result.rows[0].status === 'unread') {
      await pool.query(
        'UPDATE contact_messages SET status = $1 WHERE id = $2',
        ['read', id]
      );
      result.rows[0].status = 'read';
    }

    res.json({
      success: true,
      message: result.rows[0]
    });

  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({ error: 'Server error fetching contact message' });
  }
});

// Reply to contact message (Admin only)
router.post('/admin/messages/:id/reply', verifyToken, requireAdmin, [
  body('reply').trim().isLength({ min: 10 }).withMessage('Reply must be at least 10 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { reply } = req.body;

    // Check if message exists
    const messageResult = await pool.query(
      'SELECT id, email, name FROM contact_messages WHERE id = $1',
      [id]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    // Update message with reply
    const result = await pool.query(`
      UPDATE contact_messages 
      SET 
        admin_reply = $1, 
        replied_by = $2, 
        replied_at = CURRENT_TIMESTAMP,
        status = 'replied'
      WHERE id = $3
      RETURNING *
    `, [reply, req.user.id, id]);

    // Log admin activity
    await pool.query(`
      INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details) 
      VALUES ($1, $2, $3, $4, $5)
    `, [
      req.user.id, 
      'replied_to_contact_message', 
      'contact_message', 
      id,
      { customerEmail: messageResult.rows[0].email, customerName: messageResult.rows[0].name }
    ]);

    res.json({
      success: true,
      message: 'Reply sent successfully',
      contactMessage: result.rows[0]
    });

    // Here you could integrate with email service to actually send the reply
    // For now, it's just stored in the database

  } catch (error) {
    console.error('Reply to contact message error:', error);
    res.status(500).json({ error: 'Server error sending reply' });
  }
});

// Update message status (Admin only)
router.put('/admin/messages/:id/status', verifyToken, requireAdmin, [
  body('status').isIn(['unread', 'read', 'replied']).withMessage('Valid status is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({
      success: true,
      message: 'Message status updated successfully',
      contactMessage: result.rows[0]
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ error: 'Server error updating message status' });
  }
});

// Get contact statistics (Admin only)
router.get('/admin/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE status = 'unread') as unread_count,
        COUNT(*) FILTER (WHERE status = 'read') as read_count,
        COUNT(*) FILTER (WHERE status = 'replied') as replied_count,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as this_week,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as this_month
      FROM contact_messages
    `);

    res.json({
      success: true,
      stats: {
        totalMessages: parseInt(stats.rows[0].total_messages),
        unreadCount: parseInt(stats.rows[0].unread_count),
        readCount: parseInt(stats.rows[0].read_count),
        repliedCount: parseInt(stats.rows[0].replied_count),
        thisWeek: parseInt(stats.rows[0].this_week),
        thisMonth: parseInt(stats.rows[0].this_month)
      }
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ error: 'Server error fetching contact statistics' });
  }
});

module.exports = router;
