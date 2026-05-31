const mysql = require('mysql2/promise');

let pool;

async function connectWithRetry(retries = 10, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        user: process.env.DB_USER || 'libuser',
        password: process.env.DB_PASSWORD || 'libpass123',
        database: process.env.DB_NAME || 'libmgmt',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Test the connection
      const connection = await pool.getConnection();
      console.log(`✅ MySQL connected on attempt ${attempt}`);
      connection.release();
      return pool;
    } catch (err) {
      console.log(
        `⏳ MySQL connection attempt ${attempt}/${retries} failed: ${err.message}`
      );
      if (attempt === retries) {
        console.error('❌ Could not connect to MySQL after maximum retries');
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectWithRetry() first.');
  }
  return pool;
}

module.exports = { connectWithRetry, getPool };
