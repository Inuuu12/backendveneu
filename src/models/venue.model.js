const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

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
        owner_id
    } = venueData;

    const id = uuidv4();
    const sql = `
    INSERT INTO venues (id, name, thumbnail, description, latitude, longitude, availability, category, owner_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    await db.query(sql, [id, name, thumbnail, description, latitude, longitude, availability || 1, category, owner_id]);
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

exports.addVenueImage = async (venue_id, imageUrl) => {
    const id = uuidv4();
    const sql = `
    INSERT INTO venue_images (id, venue_id, image_url)
    VALUES (?, ?, ?)
  `;
    await db.query(sql, [id, venue_id, imageUrl]);
    return id;
};

exports.getVenueImages = async (venueId) => {
    const sql = 'SELECT * FROM venue_images WHERE venue_id = ?';
    const [rows] = await db.query(sql, [venueId]);
    return rows;
};

exports.updateVenue = async (id, venueData) => {
    const { name, thumbnail, description, latitude, longitude, category, availability } = venueData;
    const sql = `
    UPDATE venues 
    SET name = ?, thumbnail = ?, description = ?, latitude = ?, longitude = ?, category = ?, availability = ?
    WHERE id = ?
  `;
    const [result] = await db.query(sql, [name, thumbnail, description, latitude, longitude, category, availability, id]);
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
