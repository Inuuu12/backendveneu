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

exports.getAllVenues = async () => {
    const sql = `
    SELECT v.*, 
    COALESCE(JSON_ARRAYAGG(i.image_url), '[]') AS images,
    u.name as owner_name,
    u.email as owner_email
    FROM venues v
    LEFT JOIN venue_images i ON v.id = i.venue_id
    LEFT JOIN users u ON v.owner_id = u.id
    GROUP BY v.id
  `;
    const [rows] = await db.query(sql);
    return rows;
};

exports.getVenueById = async (id) => {
    const sql = `
    SELECT v.*, 
    COALESCE(JSON_ARRAYAGG(i.image_url), '[]') AS images,
    u.name as owner_name,
    u.email as owner_email
    FROM venues v
    LEFT JOIN venue_images i ON v.id = i.venue_id
    LEFT JOIN users u ON v.owner_id = u.id
    WHERE v.id = ?
    GROUP BY v.id
  `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};

exports.createVenue = async (venueData = {}) => {
    const {
        name,
        thumbnail,
        description,
        latitude,
        longitude,
        availability,
        category,
        address,
        city,
        location,
        price_per_day,
        capacity,
        owner_id
    } = venueData;

    const id = uuidv4();
    const sql = `
    INSERT INTO venues (
      id, name, thumbnail, description, latitude, longitude, availability,
      category, address, city, location, price_per_day, capacity, owner_id
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    await db.query(sql, [
        id,
        name,
        thumbnail,
        description,
        latitude,
        longitude,
        availability ?? 1,
        category,
        address,
        city,
        location,
        price_per_day,
        capacity,
        owner_id
    ]);
    return id;
};

exports.addRating = async (venue_id, user_id, rating, comment) => {
    const id = uuidv4();
    const sql = `
    INSERT INTO venue_ratings (id, venue_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `;
    await db.query(sql, [id, venue_id, user_id, rating, comment]);
    return id;
};

exports.addVenueImage = async (venue_id, imageUrl, is_main = 0) => {
    const id = uuidv4();
    const sql = `
    INSERT INTO venue_images (id, venue_id, image_url, is_main)
    VALUES (?, ?, ?, ?)
  `;
    await db.query(sql, [id, venue_id, imageUrl, is_main]);
    return id;
};

exports.getVenueImages = async (venueId) => {
    const sql = 'SELECT * FROM venue_images WHERE venue_id = ?';
    const [rows] = await db.query(sql, [venueId]);
    return rows;
};

exports.updateVenue = async (id, venueData) => {
    const allowedFields = [
        'name',
        'thumbnail',
        'description',
        'latitude',
        'longitude',
        'category',
        'availability',
        'address',
        'city',
        'location',
        'price_per_day',
        'capacity',
        'owner_id'
    ];
    const query = buildUpdateQuery('venues', 'id', id, venueData, allowedFields);

    if (!query) {
        return false;
    }

    const [result] = await db.query(query.sql, query.values);
    return result.affectedRows > 0;
};

exports.getVenuesByOwner = async (owner_id) => {
    const sql = `
    SELECT v.*, 
    COALESCE(JSON_ARRAYAGG(i.image_url), '[]') AS images
    FROM venues v
    LEFT JOIN venue_images i ON v.id = i.venue_id
    WHERE v.owner_id = ?
    GROUP BY v.id
  `;
    const [rows] = await db.query(sql, [owner_id]);
    return rows;
};

exports.deleteVenue = async (id) => {
    const sql = 'DELETE FROM venues WHERE id = ?';
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
};

exports.updateVenueImage = async (imageId, data) => {
    const query = buildUpdateQuery('venue_images', 'id', imageId, data, ['image_url', 'is_main']);
    if (!query) return false;

    const [result] = await db.query(query.sql, query.values);
    return result.affectedRows > 0;
};

exports.deleteVenueImage = async (imageId) => {
    const [result] = await db.query('DELETE FROM venue_images WHERE id = ?', [imageId]);
    return result.affectedRows > 0;
};

exports.getVenueRatings = async (venueId) => {
    const sql = `
    SELECT r.*, u.name AS user_name
    FROM venue_ratings r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.venue_id = ?
    ORDER BY r.created_at DESC
  `;
    const [rows] = await db.query(sql, [venueId]);
    return rows;
};

exports.updateRating = async (ratingId, data) => {
    const query = buildUpdateQuery('venue_ratings', 'id', ratingId, data, ['rating', 'comment']);
    if (!query) return false;

    const [result] = await db.query(query.sql, query.values);
    return result.affectedRows > 0;
};

exports.deleteRating = async (ratingId) => {
    const [result] = await db.query('DELETE FROM venue_ratings WHERE id = ?', [ratingId]);
    return result.affectedRows > 0;
};

exports.getVenueCategories = async (venueId) => {
    const [rows] = await db.query('SELECT * FROM venue_categories WHERE venue_id = ?', [venueId]);
    return rows;
};

exports.addVenueCategory = async (venueId, data) => {
    const id = uuidv4();
    const sql = `
    INSERT INTO venue_categories (id, venue_id, category, name, description)
    VALUES (?, ?, ?, ?, ?)
  `;
    await db.query(sql, [id, venueId, data.category, data.name, data.description]);
    return id;
};

exports.updateVenueCategory = async (categoryId, data) => {
    const query = buildUpdateQuery('venue_categories', 'id', categoryId, data, ['category', 'name', 'description']);
    if (!query) return false;

    const [result] = await db.query(query.sql, query.values);
    return result.affectedRows > 0;
};

exports.deleteVenueCategory = async (categoryId) => {
    const [result] = await db.query('DELETE FROM venue_categories WHERE id = ?', [categoryId]);
    return result.affectedRows > 0;
};

exports.getVenueFees = async (venueId) => {
    const [rows] = await db.query('SELECT * FROM venue_fees WHERE venue_id = ?', [venueId]);
    return rows;
};

exports.addVenueFee = async (venueId, data) => {
    const id = uuidv4();
    const sql = `
    INSERT INTO venue_fees (id, venue_id, name, amount, type)
    VALUES (?, ?, ?, ?, ?)
  `;
    await db.query(sql, [id, venueId, data.name, data.amount, data.type]);
    return id;
};

exports.updateVenueFee = async (feeId, data) => {
    const query = buildUpdateQuery('venue_fees', 'id', feeId, data, ['name', 'amount', 'type']);
    if (!query) return false;

    const [result] = await db.query(query.sql, query.values);
    return result.affectedRows > 0;
};

exports.deleteVenueFee = async (feeId) => {
    const [result] = await db.query('DELETE FROM venue_fees WHERE id = ?', [feeId]);
    return result.affectedRows > 0;
};

exports.getVenueFeatures = async (venueId) => {
    const [rows] = await db.query('SELECT * FROM venue_features WHERE venue_id = ?', [venueId]);
    return rows;
};

exports.addVenueFeature = async (venueId, data) => {
    const id = uuidv4();
    const sql = `
    INSERT INTO venue_features (id, venue_id, name, value, icon)
    VALUES (?, ?, ?, ?, ?)
  `;
    await db.query(sql, [id, venueId, data.name, data.value, data.icon]);
    return id;
};

exports.updateVenueFeature = async (featureId, data) => {
    const query = buildUpdateQuery('venue_features', 'id', featureId, data, ['name', 'value', 'icon']);
    if (!query) return false;

    const [result] = await db.query(query.sql, query.values);
    return result.affectedRows > 0;
};

exports.deleteVenueFeature = async (featureId) => {
    const [result] = await db.query('DELETE FROM venue_features WHERE id = ?', [featureId]);
    return result.affectedRows > 0;
};
