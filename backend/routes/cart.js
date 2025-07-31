const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        ci.id, ci.quantity, ci.created_at,
        p.id as product_id, p.name, p.slug, p.price, p.emoji, 
        p.stock_quantity, p.is_active,
        c.slug as category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.user_id = $1 AND p.is_active = TRUE
      ORDER BY ci.created_at DESC
    `;

    const result = await pool.query(query, [req.user.id]);

    const cartItems = result.rows.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        slug: item.slug,
        price: parseFloat(item.price),
        emoji: item.emoji,
        stockQuantity: item.stock_quantity,
        inStock: item.stock_quantity > 0,
        category: item.category || 'uncategorized'
      },
      addedAt: item.created_at
    }));

    // Calculate totals
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    res.json({
      success: true,
      cart: {
        items: cartItems,
        itemCount,
        totalAmount: Math.round(totalAmount * 100) / 100 // Round to 2 decimal places
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error fetching cart' });
  }
});

// Add item to cart
router.post('/add', verifyToken, [
  body('productId').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and is active
    const productResult = await pool.query(
      'SELECT id, name, stock_quantity, is_active FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    if (!product.is_active) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock. Only ${product.stock_quantity} items available.` 
      });
    }

    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    let result;
    if (existingItem.rows.length > 0) {
      // Update existing item
      const newQuantity = existingItem.rows[0].quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({ 
          error: `Cannot add ${quantity} more items. Only ${product.stock_quantity - existingItem.rows[0].quantity} more available.` 
        });
      }

      result = await pool.query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Create new cart item
      result = await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, productId, quantity]
      );
    }

    res.json({
      success: true,
      message: `${product.name} added to cart`,
      cartItem: result.rows[0]
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error adding item to cart' });
  }
});

// Update cart item quantity
router.put('/item/:id', verifyToken, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { quantity } = req.body;

    // Get cart item with product info
    const cartItemResult = await pool.query(`
      SELECT ci.id, ci.product_id, p.name, p.stock_quantity, p.is_active
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = $1 AND ci.user_id = $2
    `, [id, req.user.id]);

    if (cartItemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const cartItem = cartItemResult.rows[0];

    if (!cartItem.is_active) {
      return res.status(400).json({ error: 'Product is no longer available' });
    }

    if (cartItem.stock_quantity < quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock. Only ${cartItem.stock_quantity} items available.` 
      });
    }

    // Update quantity
    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    res.json({
      success: true,
      message: 'Cart updated successfully',
      cartItem: result.rows[0]
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Server error updating cart item' });
  }
});

// Remove item from cart
router.delete('/item/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });

  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Server error removing cart item' });
  }
});

// Clear entire cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error clearing cart' });
  }
});

module.exports = router;
