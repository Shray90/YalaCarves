const pool = require('../config/database');

async function testUsersAPI() {
  try {
    console.log('Testing users API queries...');
    
    // Test the main users query (similar to what the frontend calls)
    const query = `
      SELECT 
        id, name, email, phone, is_admin, is_active, created_at, last_login,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.id AND status != 'cancelled') as total_spent
      FROM users
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const result = await pool.query(query);
    console.log(`Found ${result.rows.length} users:`);
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.is_admin ? 'Admin' : 'User'} | Status: ${user.is_active ? 'Active' : 'Inactive'}`);
      console.log(`   Orders: ${user.order_count} | Total Spent: Rs ${user.total_spent}`);
      console.log(`   Joined: ${new Date(user.created_at).toLocaleDateString()}`);
      console.log('');
    });
    
    // Test user statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_users,
        COUNT(CASE WHEN is_admin = false THEN 1 END) as regular_users
      FROM users
    `;
    
    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];
    
    console.log('📊 User Statistics:');
    console.log(`   Total Users: ${stats.total_users}`);
    console.log(`   Active Users: ${stats.active_users}`);
    console.log(`   Admin Users: ${stats.admin_users}`);
    console.log(`   Regular Users: ${stats.regular_users}`);
    
    // Test a specific user query
    if (result.rows.length > 0) {
      const firstUser = result.rows[0];
      console.log(`\nTesting single user query for ID ${firstUser.id}:`);
      
      const singleUserQuery = `
        SELECT id, name, email, phone, is_admin, is_active, created_at, last_login
        FROM users
        WHERE id = $1
      `;
      
      const singleResult = await pool.query(singleUserQuery, [firstUser.id]);
      if (singleResult.rows.length > 0) {
        const user = singleResult.rows[0];
        console.log(`✅ User found: ${user.name} (${user.email})`);
        console.log(`   Admin: ${user.is_admin ? 'Yes' : 'No'}`);
        console.log(`   Active: ${user.is_active ? 'Yes' : 'No'}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing users API:', error);
    process.exit(1);
  }
}

testUsersAPI();
