const db = require('../config/db');

exports.getAllVenues = (callback) => {
  const sql = `
    SELECT v.*, 
    JSON_ARRAYAGG(i.image_url) AS images
    FROM venues v
    LEFT JOIN venue_images i ON v.id = i.venue_id
    GROUP BY v.id
  `;
  db.query(sql, callback);
};

exports.getVenueById = (id, callback) => {
  const sql = `
    SELECT v.*, 
    JSON_ARRAYAGG(i.image_url) AS images
    FROM venues v
    LEFT JOIN venue_images i ON v.id = i.venue_id
    WHERE v.id = ?
    GROUP BY v.id
  `;
  db.query(sql, [id], callback);
};