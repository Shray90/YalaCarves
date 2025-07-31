const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    // Get various statistics in parallel
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      topProducts,
      monthlyRevenue
    ] = await Promise.all([
      // Total products
      pool.query('SELECT COUNT(*) FROM products WHERE is_active = TRUE'),
      
      // Total orders
      pool.query('SELECT COUNT(*) FROM orders'),
      
      // Total users (excluding admins)
      pool.query('SELECT COUNT(*) FROM users WHERE is_admin = FALSE'),
      
      // Pending orders
      pool.query('SELECT COUNT(*) FROM orders WHERE status = $1', ['pending']),
      
      // Low stock products (less than 5 items)
      pool.query(`
        SELECT id, name, stock_quantity 
        FROM products 
        WHERE stock_quantity < 5 AND is_active = TRUE 
        ORDER BY stock_quantity ASC
        LIMIT 10
      `),
      
      // Recent orders
      pool.query(`
        SELECT 
          o.id, o.order_number, o.total_amount, o.status, o.created_at,
          u.name as customer_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
      `),
      
      // Top selling products
      pool.query(`
        SELECT 
          p.id, p.name, p.emoji, SUM(oi.quantity) as total_sold
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id, p.name, p.emoji
        ORDER BY total_sold DESC
        LIMIT 5
      `),
      
      // Monthly revenue for current year
      pool.query(`
        SELECT 
          EXTRACT(MONTH FROM created_at) as month,
          SUM(total_amount) as revenue
        FROM orders 
        WHERE 
          EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
          AND status != 'cancelled'
        GROUP BY EXTRACT(MONTH FROM created_at)
        ORDER BY month
      `)
    ]);

    // Calculate total revenue
    const totalRevenueResult = await pool.query(`
      SELECT SUM(total_amount) as total_revenue
      FROM orders 
      WHERE status NOT IN ('cancelled')
    `);

    const stats = {
      overview: {
        totalProducts: parseInt(totalProducts.rows[0].count),
        totalOrders: parseInt(totalOrders.rows[0].count),
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalRevenue: parseFloat(totalRevenueResult.rows[0].total_revenue || 0),
        pendingOrders: parseInt(pendingOrders.rows[0].count)
      },
      lowStockProducts: lowStockProducts.rows,
      recentOrders: recentOrders.rows.map(order => ({
        ...order,
        totalAmount: parseFloat(order.total_amount)
      })),
      topProducts: topProducts.rows.map(product => ({
        ...product,
        totalSold: parseInt(product.total_sold)
      })),
      monthlyRevenue: monthlyRevenue.rows.map(item => ({
        month: parseInt(item.month),
        revenue: parseFloat(item.revenue)
      }))
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard statistics' });
  }
});

// Get all categories
router.get('/categories', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, c.name, c.slug, c.description, c.created_at,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
      GROUP BY c.id, c.name, c.slug, c.description, c.created_at
      ORDER BY c.name
    `);

    const categories = result.rows.map(category => ({
      ...category,
      productCount: parseInt(category.product_count)
    }));

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
});

// Create new category
router.post('/categories', verifyToken, requireAdmin, [
  body('name').trim().isLength({ min: 1 }).withMessage('Category name is required'),
  body('description').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // Generate slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingCategory = await pool.query(
      'SELECT id FROM categories WHERE slug = $1',
      [slug]
    );

    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: 'A category with this name already exists' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: result.rows[0]
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error creating category' });
  }
});

// Get all users
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    let whereCondition = '';
    let queryParams = [];

    if (search) {
      whereCondition = 'WHERE (name ILIKE $1 OR email ILIKE $1)';
      queryParams.push(`%${search}%`);
    }

    const query = `
      SELECT 
        id, name, email, phone, is_admin, created_at,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.id AND status != 'cancelled') as total_spent
      FROM users
      ${whereCondition}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    const users = result.rows.map(user => ({
      ...user,
      orderCount: parseInt(user.order_count),
      totalSpent: parseFloat(user.total_spent)
    }));

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Get inventory logs
router.get('/inventory/logs', verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      productId
    } = req.query;

    const offset = (page - 1) * limit;
    let whereCondition = '';
    let queryParams = [];

    if (productId) {
      whereCondition = 'WHERE il.product_id = $1';
      queryParams.push(productId);
    }

    const query = `
      SELECT 
        il.id, il.change_type, il.quantity_change, il.previous_quantity,
        il.new_quantity, il.reason, il.created_at,
        p.name as product_name,
        u.name as changed_by_name
      FROM inventory_logs il
      JOIN products p ON il.product_id = p.id
      LEFT JOIN users u ON il.changed_by = u.id
      ${whereCondition}
      ORDER BY il.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      logs: result.rows
    });

  } catch (error) {
    console.error('Get inventory logs error:', error);
    res.status(500).json({ error: 'Server error fetching inventory logs' });
  }
});

// Bulk update stock
router.post('/inventory/bulk-update', verifyToken, requireAdmin, [
  body('updates').isArray().withMessage('Updates must be an array'),
  body('updates.*.productId').isInt({ min: 1 }),
  body('updates.*.newStock').isInt({ min: 0 }),
  body('updates.*.reason').optional().trim(),
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ errors: errors.array() });
    }

    const { updates } = req.body;
    const updatedProducts = [];

    for (const update of updates) {
      const { productId, newStock, reason } = update;

      // Get current stock
      const currentResult = await client.query(
        'SELECT name, stock_quantity FROM products WHERE id = $1',
        [productId]
      );

      if (currentResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Product with ID ${productId} not found` });
      }

      const currentStock = currentResult.rows[0].stock_quantity;
      const stockChange = newStock - currentStock;

      // Update stock
      await client.query(
        'UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newStock, productId]
      );

      // Log the change
      await client.query(`
        INSERT INTO inventory_logs (
          product_id, change_type, quantity_change, 
          previous_quantity, new_quantity, reason, changed_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        productId, 
        stockChange > 0 ? 'add' : 'remove',
        stockChange,
        currentStock,
        newStock,
        reason || 'Bulk stock update',
        req.user.id
      ]);

      updatedProducts.push({
        productId,
        name: currentResult.rows[0].name,
        previousStock: currentStock,
        newStock,
        change: stockChange
      });
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Successfully updated stock for ${updatedProducts.length} products`,
      updatedProducts
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk update stock error:', error);
    res.status(500).json({ error: 'Server error updating stock' });
  } finally {
    client.release();
  }
});

module.exports = router;
