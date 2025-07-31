const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    const email = 'admin@yala.com';
    const password = 'Admin@123'; // Default password, recommend to change after first login
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = 'Admin User';
    const isAdmin = true;

    // Check if admin user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    // Insert admin user
    await pool.query(
      'INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, isAdmin]
    );

    console.log('Default admin user created successfully.');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
