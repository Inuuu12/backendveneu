const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const buildUpdateQuery = (table, idField, id, data, allowedFields) => {
  const fields = allowedFields.filter((field) => Object.prototype.hasOwnProperty.call(data, field));

  if (fields.length === 0) {
    return null;
  }

  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  return {
    sql: `UPDATE ${table} SET ${setClause} WHERE ${idField} = ?`,
    values: [...values, id]
  };
};

// Create booking
exports.createBooking = async (bookingData) => {
  const {
    venue_id,
    user_id,
    booking_date,
    start_time,
    end_time,
    duration_hours,
    note,
    adult_guests,
    child_guests,
    total_price,
    payment_status,
    payment_method
  } = bookingData;

  // Check availability (no overlapping bookings)
  const sql_check = `
    SELECT * FROM bookings 
    WHERE venue_id = ? 
    AND booking_date = ? 
    AND status != 'cancelled'
    AND (
      (start_time < ? AND end_time > ?)
      OR (start_time < ? AND end_time > ?)
      OR (start_time >= ? AND end_time <= ?)
    )
  `;
  
  const [conflicts] = await db.query(sql_check, [
    venue_id, 
    booking_date,
    end_time, start_time,
    end_time, start_time,
    start_time, end_time
  ]);

  if (conflicts.length > 0) {
    throw new Error('Time slot is not available. Please choose another time.');
  }

  // Create booking
  const id = uuidv4();
  const sql = `
    INSERT INTO bookings (
      id, venue_id, user_id, booking_date, start_time, end_time, duration_hours,
      note, status, adult_guests, child_guests, total_price, payment_status, payment_method
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)
  `;
  
  await db.query(sql, [
    id,
    venue_id,
    user_id,
    booking_date,
    start_time,
    end_time,
    duration_hours,
    note,
    adult_guests,
    child_guests,
    total_price,
    payment_status || 'pending',
    payment_method
  ]);
  return id;
};

exports.getAllBookings = async () => {
  const sql = `
    SELECT 
      b.*,
      u.name as user_name,
      u.email as user_email,
      v.name as venue_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN venues v ON b.venue_id = v.id
    ORDER BY b.booking_date DESC, b.start_time DESC
  `;

  const [rows] = await db.query(sql);
  return rows;
};

// Get all bookings for a venue
exports.getVenueBookings = async (venue_id) => {
  const sql = `
    SELECT 
      b.*, 
      u.name as user_name,
      u.email as user_email
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.venue_id = ?
    ORDER BY b.booking_date DESC, b.start_time DESC
  `;
  
  const [rows] = await db.query(sql, [venue_id]);
  return rows;
};

// Get user bookings
exports.getUserBookings = async (user_id) => {
  const sql = `
    SELECT 
      b.*,
      v.name as venue_name,
      v.latitude,
      v.longitude,
      v.category
    FROM bookings b
    JOIN venues v ON b.venue_id = v.id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC, b.start_time DESC
  `;
  
  const [rows] = await db.query(sql, [user_id]);
  return rows;
};

// Get booking by ID
exports.getBookingById = async (id) => {
  const sql = `
    SELECT 
      b.*,
      u.name as user_name,
      u.email as user_email,
      v.name as venue_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN venues v ON b.venue_id = v.id
    WHERE b.id = ?
  `;
  
  const [rows] = await db.query(sql, [id]);
  return rows[0];
};

// Update booking status
exports.updateBookingStatus = async (id, status) => {
  const sql = `
    UPDATE bookings 
    SET status = ?
    WHERE id = ?
  `;
  
  const [result] = await db.query(sql, [status, id]);
  return result.affectedRows > 0;
};

exports.updateBooking = async (id, data) => {
  const allowedFields = [
    'venue_id',
    'booking_date',
    'start_time',
    'end_time',
    'duration_hours',
    'note',
    'status',
    'adult_guests',
    'child_guests',
    'total_price',
    'payment_status',
    'payment_method'
  ];
  const query = buildUpdateQuery('bookings', 'id', id, data, allowedFields);

  if (!query) {
    return false;
  }

  const [result] = await db.query(query.sql, query.values);
  return result.affectedRows > 0;
};

exports.updatePaymentStatus = async (id, payment_status, payment_method) => {
  const data = { payment_status };

  if (payment_method !== undefined) {
    data.payment_method = payment_method;
  }

  return exports.updateBooking(id, data);
};

// Cancel booking
exports.cancelBooking = async (id) => {
  const sql = `
    UPDATE bookings 
    SET status = 'cancelled'
    WHERE id = ?
  `;
  
  const [result] = await db.query(sql, [id]);
  return result.affectedRows > 0;
};

exports.deleteBooking = async (id) => {
  const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Check availability for a time slot
exports.checkAvailability = async (venue_id, booking_date, start_time, end_time) => {
  const sql = `
    SELECT COUNT(*) as count FROM bookings 
    WHERE venue_id = ? 
    AND booking_date = ?
    AND status != 'cancelled'
    AND (
      (start_time < ? AND end_time > ?)
      OR (start_time < ? AND end_time > ?)
      OR (start_time >= ? AND end_time <= ?)
    )
  `;
  
  const [result] = await db.query(sql, [
    venue_id, 
    booking_date,
    end_time, start_time,
    end_time, start_time,
    start_time, end_time
  ]);

  return result[0].count === 0;
};

