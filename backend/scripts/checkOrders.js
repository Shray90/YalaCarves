const pool = require('../config/database');

async function checkOrders() {
  try {
    console.log('Checking orders in database...');
    
    // Check total orders count
    const countResult = await pool.query('SELECT COUNT(*) FROM orders');
    console.log(`Total orders in database: ${countResult.rows[0].count}`);
    
    // Get recent orders
    const ordersResult = await pool.query(`
      SELECT 
        o.id, o.order_number, o.total_amount, o.status, 
        o.payment_status, o.created_at,
        u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    
    console.log('\nRecent orders:');
    ordersResult.rows.forEach(order => {
      console.log(`- Order #${order.order_number} by ${order.customer_name} (${order.customer_email})`);
      console.log(`  Status: ${order.status}, Amount: Rs ${order.total_amount}, Date: ${order.created_at}`);
    });
    
    // Check order items
    const itemsResult = await pool.query(`
      SELECT 
        oi.order_id, oi.quantity, oi.price,
        p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      ORDER BY oi.order_id DESC
      LIMIT 10
    `);
    
    console.log('\nRecent order items:');
    itemsResult.rows.forEach(item => {
      console.log(`- Order ${item.order_id}: ${item.quantity}x ${item.product_name} @ Rs ${item.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking orders:', error);
    process.exit(1);
  }
}

checkOrders();
