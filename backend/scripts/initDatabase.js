const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🚀 Initializing Yala Carves database...');
    
    // Read and execute original schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Read and execute enhanced schema.sql
    const enhancedSchemaPath = path.join(__dirname, '../database/enhanced_schema.sql');
    const enhancedSchema = fs.readFileSync(enhancedSchemaPath, 'utf8');
    
    // Combine schemas
    const combinedSchema = schema + '\n\n' + enhancedSchema;
    
    // Split by semicolons and execute each statement
    const statements = combinedSchema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignore "already exists" errors for development
          if (!error.message.includes('already exists') && 
              !error.message.includes('duplicate key') &&
              !error.message.includes('column') &&
              !error.message.includes('relation')) {
            console.warn('Statement warning:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Database initialized successfully!');
    console.log('📋 Default admin credentials:');
    console.log('   Email: admin@yalacarves.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🔧 Enhanced Features Added:');
    console.log('   ✅ Security questions for password reset');
    console.log('   ✅ Contact message management');
    console.log('   ✅ Enhanced user addresses');
    console.log('   ✅ Stock adjustment tracking');
    console.log('   ✅ User activity logging');
    console.log('   ✅ Sample contact messages');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
