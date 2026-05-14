require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'venue_db',
  port: Number(process.env.DB_PORT || 3306),
  multipleStatements: true
});

db.getConnection()
  .then((connection) => {
    connection.release();
    console.log('MySQL connected');
  })
  .catch((err) => console.error('MySQL connection failed:', err.message));

module.exports = db;
