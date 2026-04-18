const Venue = require('../models/venue.model');

exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.getVenueById(id);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json(venue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.getAllVenues();
    res.json(venues);
  } catch (err) {
    console.error('getVenues error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMyVenues = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only owners can access their venues' });
    }
    
    const venues = await Venue.getVenuesByOwner(req.user.id);
    res.json(venues);
  } catch (err) {
    console.error('getMyVenues error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const venueData = { ...req.body };
    
    // If user is owner, set owner_id to their user id
    if (req.user.role === 'owner') {
      venueData.owner_id = req.user.id;
    }
    
    const venueId = await Venue.createVenue(venueData);
    res.status(201).json({
      message: 'Venue created successfully',
      venueId
    });
  } catch (err) {
    console.error('createVenue error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { id: venue_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id; // From auth middleware

    const ratingId = await Venue.addRating(venue_id, user_id, rating, comment);
    res.status(201).json({
      message: 'Rating added successfully',
      ratingId
    });
  } catch (err) {
    console.error('addRating error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addVenueImage = async (req, res) => {
  try {
    const { id: venue_id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const imageId = await Venue.addVenueImage(venue_id, imageUrl);

    res.status(201).json({
      message: 'Image added successfully',
      imageId,
      imageUrl
    });
  } catch (err) {
    console.error('addVenueImage error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Venue.updateVenue(id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Venue not found or no changes made' });
    }
    res.json({ message: 'Venue updated successfully' });
  } catch (err) {
    console.error('updateVenue error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Venue.deleteVenue(id);
    if (!success) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json({ message: 'Venue deleted successfully' });
  } catch (err) {
    console.error('deleteVenue error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getVenueImages = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const images = await Venue.getVenueImages(venueId);

    res.json({
      status: 'success',
      data: images
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};