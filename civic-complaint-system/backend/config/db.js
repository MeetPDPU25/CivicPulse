const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'pma',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test_civic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    console.log(' Connected to MySQL database:', process.env.DB_NAME || 'test_civic');
    
    // Read and run schema.sql
    const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await connection.query(schemaSql);
      console.log(' Database schema initialized successfully');
    }
    connection.release();
  } catch (error) {
    console.error(' Database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params),
  initDB
};
