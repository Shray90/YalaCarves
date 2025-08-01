const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function checkAdminUser() {
  try {
    console.log('Checking admin users...');
    
    // Check if admin user exists
    const adminResult = await pool.query('SELECT * FROM users WHERE is_admin = true');
    console.log('Admin users found:', adminResult.rows.length);
    
    adminResult.rows.forEach(admin => {
      console.log(`- ${admin.email} (${admin.name}) - ID: ${admin.id}`);
    });
    
    // Check if admin@yala.com exists
    const specificAdminResult = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@yala.com']);
    
    if (specificAdminResult.rows.length === 0) {
      console.log('\nCreating admin@yala.com user...');
      
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)',
        ['Admin User', 'admin@yala.com', hashedPassword, true]
      );
      
      console.log('✅ Admin user created: admin@yala.com / Admin@123');
    } else {
      console.log('\n✅ Admin user already exists: admin@yala.com / Admin@123');
      console.log('Admin details:', specificAdminResult.rows[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin user:', error);
    process.exit(1);
  }
}

checkAdminUser();
