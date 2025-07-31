const { Pool } = require('pg');
require('dotenv').config();

console.log("🔌 Attempting to connect to the database...");

console.log('Loaded env variables:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  db: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '✅ set' : '❌ missing',
  port: process.env.DB_PORT,
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connected successfully! Server time:', res.rows[0].now);
  }
  pool.end();
});
