const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    // Create multiple test users
    const users = [
      {
        email: 'user@yala.com',
        password: 'User@123',
        name: 'Regular User',
        isAdmin: false
      },
      {
        email: 'customer@yala.com',
        password: 'Customer@123',
        name: 'Customer User',
        isAdmin: false
      },
      {
        email: 'test@yala.com',
        password: 'Test@123',
        name: 'Test User',
        isAdmin: false
      }
    ];

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [userData.email]);

      if (existingUser.rows.length > 0) {
        console.log(`User ${userData.email} already exists.`);
        continue;
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await pool.query(
        'INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)',
        [userData.name, userData.email, hashedPassword, userData.isAdmin]
      );

      console.log(`✅ Created user: ${userData.email} / ${userData.password}`);
    }

    console.log('\n🎉 Regular user accounts created successfully!');
    console.log('\n📝 Login credentials:');
    users.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
}

createTestUser();
