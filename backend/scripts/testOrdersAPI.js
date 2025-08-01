const pool = require('../config/database');

async function testOrdersAPI() {
  try {
    console.log('Testing orders API query...');
    
    const query = `
      SELECT 
        o.id, o.order_number, o.total_amount, o.status, 
        o.payment_status, o.payment_method, o.created_at,
        u.id as user_id, u.name as customer_name, u.email as customer_email,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
               o.payment_method, o.created_at, u.id, u.name, u.email
      ORDER BY o.created_at DESC
      LIMIT 20 OFFSET 0
    `;

    const result = await pool.query(query);
    console.log('Query result:', result.rows);

    // Test the detailed items query for the first order
    if (result.rows.length > 0) {
      const orderId = result.rows[0].id;
      console.log(`\nTesting items query for order ${orderId}...`);
      
      const itemsQuery = `
        SELECT 
          oi.id, oi.quantity, oi.price,
          p.id as product_id, p.name as product_name, p.emoji
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `;
      const itemsResult = await pool.query(itemsQuery, [orderId]);
      console.log('Items result:', itemsResult.rows);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing API:', error);
    process.exit(1);
  }
}

testOrdersAPI();
