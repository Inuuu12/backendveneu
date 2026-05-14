const fs = require('fs');
const path = require('path');
const db = require('./db');

async function runSchema() {
  let connection;

  try {
    console.log('Resetting database and running schema.sql...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    connection = await db.getConnection();

    console.log('Dropping existing tables...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DROP TABLE IF EXISTS venue_fees');
    await connection.query('DROP TABLE IF EXISTS venue_ratings');
    await connection.query('DROP TABLE IF EXISTS bookings');
    await connection.query('DROP TABLE IF EXISTS venue_categories');
    await connection.query('DROP TABLE IF EXISTS venue_images');
    await connection.query('DROP TABLE IF EXISTS venues');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Rebuilding tables...');
    await connection.query(schema);

    console.log('Database rebuilt successfully with UUID support');
    process.exit(0);
  } catch (err) {
    console.error('Schema execution failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

runSchema();
