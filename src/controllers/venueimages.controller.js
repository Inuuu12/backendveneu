const db = require('../config/db');

// GET images by venue
exports.getVenueImages = async (req, res) => {
  try {
    const { venueId } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM venue_images WHERE venue_id = ?',
      [venueId]
    );

    res.json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ADD image (URL only)
exports.addVenueImage = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: 'image_url is required' });
    }

    await db.query(
      'INSERT INTO venue_images (venue_id, image_url) VALUES (?, ?)',
      [venueId, image_url]
    );

    res.status(201).json({
      status: 'success',
      message: 'Venue image added'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};