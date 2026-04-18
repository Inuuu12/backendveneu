// src/config/db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'venue_db',
  multipleStatements: true
});

db.getConnection()
  .then(() => console.log('✅ MySQL Connected!'))
  .catch((err) => console.error('❌ MySQL Connection Failed: ', err.message));

module.exports = db;

console.log("DB HOST:", process.env.DB_HOST);
console.log("DB USER:", process.env.DB_USER);
console.log("DB NAME:", process.env.DB_NAME);
console.log("DB PORT:", process.env.DB_PORT);
console.log('DB FROM ENV =', process.env.DB_NAME);