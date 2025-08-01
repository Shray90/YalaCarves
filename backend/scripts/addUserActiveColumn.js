const pool = require('../config/database');

async function addUserActiveColumn() {
  try {
    console.log('Checking if is_active column exists in users table...');
    
    // Check if column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'is_active'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('Adding is_active column to users table...');
      
      // Add the column
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE
      `);
      
      console.log('✅ is_active column added successfully');
      
      // Update existing users to be active
      await pool.query(`
        UPDATE users 
        SET is_active = TRUE 
        WHERE is_active IS NULL
      `);
      
      console.log('✅ Updated existing users to active status');
    } else {
      console.log('✅ is_active column already exists');
    }
    
    // Check if last_login column exists
    const lastLoginCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'last_login'
    `);
    
    if (lastLoginCheck.rows.length === 0) {
      console.log('Adding last_login column to users table...');
      
      // Add the column
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN last_login TIMESTAMP
      `);
      
      console.log('✅ last_login column added successfully');
    } else {
      console.log('✅ last_login column already exists');
    }
    
    // Show current table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current users table structure:');
    tableInfo.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating users table:', error);
    process.exit(1);
  }
}

addUserActiveColumn();
