const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['name', 'price', 'created_at']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['p.is_active = TRUE'];
    let queryParams = [];
    let paramIndex = 1;

    // Add category filter
    if (category && category !== 'all') {
      whereConditions.push(`c.slug = $${paramIndex++}`);
      queryParams.push(category);
    }

    // Add search filter
    if (search) {
      whereConditions.push(`(
        p.name ILIKE $${paramIndex} OR 
        p.description ILIKE $${paramIndex} OR 
        p.artisan ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const orderClause = `ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;

    // Get products with category info
    const productsQuery = `
      SELECT 
        p.id, p.name, p.slug, p.description, p.price, p.original_price,
        p.artisan, p.emoji, p.stock_quantity, p.created_at,
        c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(parseInt(limit), offset);

    // Count total products for pagination
    const countQuery = `
      SELECT COUNT(*)
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      pool.query(productsQuery, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    const products = productsResult.rows.map(product => ({
      ...product,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      inStock: product.stock_quantity > 0,
      category: product.category_slug || 'uncategorized'
    }));

    const totalProducts = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// Get single product by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);
    
    const query = `
      SELECT 
        p.id, p.name, p.slug, p.description, p.price, p.original_price,
        p.artisan, p.emoji, p.stock_quantity, p.created_at, p.updated_at,
        c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE AND ${isNumeric ? 'p.id = $1' : 'p.slug = $1'}
    `;

    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = {
      ...result.rows[0],
      price: parseFloat(result.rows[0].price),
      originalPrice: result.rows[0].original_price ? parseFloat(result.rows[0].original_price) : null,
      inStock: result.rows[0].stock_quantity > 0,
      category: result.rows[0].category_slug || 'uncategorized'
    };

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error fetching product' });
  }
});

// Create new product (Admin only)
router.post('/', verifyToken, requireAdmin, [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('artisan').trim().isLength({ min: 1 }).withMessage('Artisan name is required'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      categoryId,
      artisan,
      emoji,
      stockQuantity
    } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const slugCheck = await pool.query(
      'SELECT id FROM products WHERE slug = $1',
      [slug]
    );

    if (slugCheck.rows.length > 0) {
      return res.status(400).json({ error: 'A product with this name already exists' });
    }

    // Create product
    const result = await pool.query(`
      INSERT INTO products (
        name, slug, description, price, original_price, category_id, 
        artisan, emoji, stock_quantity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      name, slug, description, price, originalPrice || null, 
      categoryId, artisan, emoji || '🎨', stockQuantity
    ]);

    // Log inventory addition
    if (stockQuantity > 0) {
      await pool.query(`
        INSERT INTO inventory_logs (
          product_id, change_type, quantity_change, 
          previous_quantity, new_quantity, reason, changed_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        result.rows[0].id, 'add', stockQuantity, 
        0, stockQuantity, 'Initial stock', req.user.id
      ]);
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error creating product' });
  }
});

// Update product (Admin only)
router.put('/:id', verifyToken, requireAdmin, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price').optional().isFloat({ min: 0 }),
  body('categoryId').optional().isInt({ min: 1 }),
  body('artisan').optional().trim().isLength({ min: 1 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Get current product for stock comparison
    const currentProduct = await pool.query(
      'SELECT stock_quantity FROM products WHERE id = $1',
      [id]
    );

    if (currentProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentStock = currentProduct.rows[0].stock_quantity;

    // Build dynamic update query
    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = key === 'categoryId' ? 'category_id' : 
                       key === 'originalPrice' ? 'original_price' :
                       key === 'stockQuantity' ? 'stock_quantity' :
                       key.replace(/([A-Z])/g, '_$1').toLowerCase();
        
        updates.push(`${dbField} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
      UPDATE products 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    // Log stock changes
    if (req.body.stockQuantity !== undefined && req.body.stockQuantity !== currentStock) {
      const stockChange = req.body.stockQuantity - currentStock;
      await pool.query(`
        INSERT INTO inventory_logs (
          product_id, change_type, quantity_change, 
          previous_quantity, new_quantity, reason, changed_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        id, stockChange > 0 ? 'add' : 'remove', stockChange,
        currentStock, req.body.stockQuantity, 'Manual adjustment', req.user.id
      ]);
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error updating product' });
  }
});

// Delete product (Admin only) - Soft delete
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE products SET is_active = FALSE WHERE id = $1 RETURNING name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: `Product "${result.rows[0].name}" deleted successfully`
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error deleting product' });
  }
});

module.exports = router;
