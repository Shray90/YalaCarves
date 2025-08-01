const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Orders API is working',
    timestamp: new Date().toISOString()
  });
});

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `YC-${timestamp.slice(-6)}-${random}`;
};

// Create new order
router.post('/', verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Order request body:', req.body);
    console.log('User:', req.user);

    const { shippingAddress, billingAddress, paymentMethod, notes, items } = req.body;

    console.log('Shipping address received:', shippingAddress);
    console.log('Items received:', items);
    console.log('Payment method received:', paymentMethod);

    // Basic validation
    if (!shippingAddress) {
      console.log('ERROR: No shipping address provided');
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    if (!shippingAddress.streetAddress) {
      console.log('ERROR: No street address provided');
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Street address is required' });
    }

    if (!shippingAddress.city) {
      console.log('ERROR: No city provided');
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'City is required' });
    }

    if (!shippingAddress.postalCode) {
      console.log('ERROR: No postal code provided');
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Postal code is required' });
    }

    if (!paymentMethod || paymentMethod !== 'cash_on_delivery') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Valid payment method is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Validate and get product details for the items
    const productIds = items.map(item => item.productId);
    const productQuery = `
      SELECT id, name, price, stock_quantity, is_active, emoji, slug
      FROM products
      WHERE id = ANY($1) AND is_active = TRUE
    `;

    const productResult = await client.query(productQuery, [productIds]);

    if (productResult.rows.length !== items.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Some products are not available' });
    }

    // Create a map of products for easy lookup
    const productMap = {};
    productResult.rows.forEach(product => {
      productMap[product.id] = product;
    });

    // Validate stock and prepare cart items
    const cartItems = [];
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
      }

      if (product.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} available.`
        });
      }

      cartItems.push({
        product_id: item.productId,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
        stock_quantity: product.stock_quantity,
        is_active: product.is_active
      });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) =>
      sum + (parseFloat(item.price) * item.quantity), 0
    );

    // Create shipping address
    const shippingAddressResult = await client.query(`
      INSERT INTO addresses (user_id, type, street_address, city, state, postal_code, country)
      VALUES ($1, 'shipping', $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      req.user.id, shippingAddress.streetAddress, shippingAddress.city,
      shippingAddress.state || null, shippingAddress.postalCode, 
      shippingAddress.country || 'Nepal'
    ]);

    // Create billing address (use shipping if not provided)
    let billingAddressId = shippingAddressResult.rows[0].id;
    if (billingAddress) {
      const billingAddressResult = await client.query(`
        INSERT INTO addresses (user_id, type, street_address, city, state, postal_code, country)
        VALUES ($1, 'billing', $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        req.user.id, billingAddress.streetAddress, billingAddress.city,
        billingAddress.state || null, billingAddress.postalCode, 
        billingAddress.country || 'Nepal'
      ]);
      billingAddressId = billingAddressResult.rows[0].id;
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const orderResult = await client.query(`
      INSERT INTO orders (
        user_id, order_number, total_amount, payment_method, 
        shipping_address_id, billing_address_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      req.user.id, orderNumber, totalAmount, paymentMethod,
      shippingAddressResult.rows[0].id, billingAddressId, notes || null
    ]);

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of cartItems) {
      // Create order item
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [order.id, item.product_id, item.quantity, item.price]);

      // Update product stock
      const newStock = item.stock_quantity - item.quantity;
      await client.query(
        'UPDATE products SET stock_quantity = $1 WHERE id = $2',
        [newStock, item.product_id]
      );

      // Log inventory change
      await client.query(`
        INSERT INTO inventory_logs (
          product_id, change_type, quantity_change,
          previous_quantity, new_quantity, reason, changed_by
        ) VALUES ($1, 'sold', $2, $3, $4, $5, $6)
      `, [
        item.product_id, -item.quantity, item.stock_quantity,
        newStock, `Order #${orderNumber}`, req.user.id
      ]);
    }

    // Note: We don't clear the database cart since we're using frontend cart

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        paymentStatus: order.payment_status,
        createdAt: order.created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error creating order' });
  } finally {
    client.release();
  }
});

// Get user's orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id, o.order_number, o.total_amount, o.status, 
        o.payment_status, o.payment_method, o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query, [req.user.id]);

    const orders = result.rows.map(order => ({
      ...order,
      totalAmount: parseFloat(order.total_amount),
      itemCount: parseInt(order.item_count)
    }));

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

// Get order details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order with addresses
    const orderQuery = `
      SELECT 
        o.*, 
        sa.street_address as shipping_street, sa.city as shipping_city,
        sa.state as shipping_state, sa.postal_code as shipping_postal,
        sa.country as shipping_country,
        ba.street_address as billing_street, ba.city as billing_city,
        ba.state as billing_state, ba.postal_code as billing_postal,
        ba.country as billing_country
      FROM orders o
      LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
      LEFT JOIN addresses ba ON o.billing_address_id = ba.id
      WHERE o.id = $1 AND o.user_id = $2
    `;

    const orderResult = await pool.query(orderQuery, [id, req.user.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.quantity, oi.price,
        p.id as product_id, p.name, p.slug, p.emoji
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;

    const itemsResult = await pool.query(itemsQuery, [id]);

    const orderDetails = {
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: parseFloat(order.total_amount),
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      notes: order.notes,
      createdAt: order.created_at,
      shippingAddress: {
        streetAddress: order.shipping_street,
        city: order.shipping_city,
        state: order.shipping_state,
        postalCode: order.shipping_postal,
        country: order.shipping_country
      },
      billingAddress: {
        streetAddress: order.billing_street,
        city: order.billing_city,
        state: order.billing_state,
        postalCode: order.billing_postal,
        country: order.billing_country
      },
      items: itemsResult.rows.map(item => ({
        product: {
          id: item.product_id,
          name: item.name,
          slug: item.slug,
          emoji: item.emoji
        },
        quantity: item.quantity,
        price: parseFloat(item.price)
      }))
    };

    res.json({
      success: true,
      order: orderDetails
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Server error fetching order details' });
  }
});

// Admin: Get all orders
router.get('/admin/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`o.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (paymentStatus) {
      whereConditions.push(`o.payment_status = $${paramIndex++}`);
      queryParams.push(paymentStatus);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const query = `
      SELECT
        o.id, o.order_number, o.total_amount, o.status,
        o.payment_status, o.payment_method, o.created_at,
        u.id as user_id, u.name as customer_name, u.email as customer_email,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id, o.order_number, o.total_amount, o.status, o.payment_status,
               o.payment_method, o.created_at, u.id, u.name, u.email
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);
    console.log('Orders query result:', result.rows);

    // Get detailed order items for each order
    const ordersWithItems = await Promise.all(
      result.rows.map(async (order) => {
        const itemsQuery = `
          SELECT
            oi.id, oi.quantity, oi.price,
            p.id as product_id, p.name as product_name, p.emoji
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = $1
        `;
        const itemsResult = await pool.query(itemsQuery, [order.id]);

        return {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: parseFloat(order.total_amount),
          status: order.status,
          paymentStatus: order.payment_status,
          paymentMethod: order.payment_method,
          createdAt: order.created_at,
          user: {
            id: order.user_id,
            name: order.customer_name,
            email: order.customer_email
          },
          items: itemsResult.rows.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price),
            product: {
              id: item.product_id,
              name: item.product_name,
              emoji: item.emoji
            }
          }))
        };
      })
    );

    console.log('Orders with items:', ordersWithItems);

    res.json({
      success: true,
      orders: ordersWithItems
    });

  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

// Admin: Update order status
router.put('/admin/:id/status', verifyToken, requireAdmin, [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  body('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updates = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
    const values = [status];
    let paramIndex = 2;

    if (paymentStatus) {
      updates.push(`payment_status = $${paramIndex++}`);
      values.push(paymentStatus);
    }

    values.push(id);

    const query = `
      UPDATE orders 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING order_number, status, payment_status
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error updating order status' });
  }
});

const moment = require('moment');

router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order to verify ownership and time
    const orderResult = await pool.query(
      'SELECT id, user_id, status, created_at FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to cancel this order' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order is already cancelled' });
    }

    const createdAt = moment(order.created_at);
    const now = moment();

    if (now.diff(createdAt, 'hours') > 5) {
      return res.status(400).json({ error: 'Order can only be cancelled within 5 hours of placement' });
    }

    // Update order status to cancelled
    const updateResult = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['cancelled', id]
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Server error cancelling order' });
  }
});

// Update order (user can update shipping address, notes before confirmation)
router.put('/:id', verifyToken, [
  body('shippingAddress').optional().isObject(),
  body('notes').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { shippingAddress, notes } = req.body;

    // Check if order exists and belongs to user
    const orderResult = await pool.query(
      'SELECT id, user_id, status FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Can only update pending orders' });
    }

    let updateQuery = 'UPDATE orders SET updated_at = CURRENT_TIMESTAMP';
    let queryParams = [];
    let paramIndex = 1;

    if (shippingAddress) {
      // Update shipping address
      const addressResult = await pool.query(`
        UPDATE addresses SET 
          street_address = $1, city = $2, state = $3, 
          postal_code = $4, country = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = (SELECT shipping_address_id FROM orders WHERE id = $6)
        RETURNING id
      `, [
        shippingAddress.streetAddress,
        shippingAddress.city,
        shippingAddress.state || null,
        shippingAddress.postalCode,
        shippingAddress.country || 'Pakistan',
        id
      ]);
    }

    if (notes !== undefined) {
      updateQuery += `, notes = $${paramIndex++}`;
      queryParams.push(notes);
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(id);

    const result = await pool.query(updateQuery, queryParams);

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Server error updating order' });
  }
});

// Delete order (only cancelled or delivered orders)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists and belongs to user
    const orderResult = await pool.query(
      'SELECT id, user_id, status FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!['cancelled', 'delivered'].includes(order.status)) {
      return res.status(400).json({ error: 'Can only delete cancelled or delivered orders' });
    }

    // Delete order (cascade will handle order_items)
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Server error deleting order' });
  }
});

module.exports = router;
