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

    if (!req.file && !req.body.image_url) {
      return res.status(400).json({ message: 'Image file or image_url is required' });
    }

    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : req.body.image_url;
    const imageId = await Venue.addVenueImage(venue_id, imageUrl, req.body.is_main ?? 0);

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

exports.updateVenueImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const success = await Venue.updateVenueImage(imageId, req.body);

    if (!success) {
      return res.status(404).json({ message: 'Image not found or no changes made' });
    }

    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteVenueImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const success = await Venue.deleteVenueImage(imageId);

    if (!success) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getVenueRatings = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const ratings = await Venue.getVenueRatings(venueId);

    res.json({ status: 'success', data: ratings });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const success = await Venue.updateRating(ratingId, req.body);

    if (!success) {
      return res.status(404).json({ message: 'Rating not found or no changes made' });
    }

    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const success = await Venue.deleteRating(ratingId);

    if (!success) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getVenueCategories = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const categories = await Venue.getVenueCategories(venueId);

    res.json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.addVenueCategory = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const categoryId = await Venue.addVenueCategory(venueId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Category added successfully',
      categoryId
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateVenueCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const success = await Venue.updateVenueCategory(categoryId, req.body);

    if (!success) {
      return res.status(404).json({ message: 'Category not found or no changes made' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteVenueCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const success = await Venue.deleteVenueCategory(categoryId);

    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getVenueFees = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const fees = await Venue.getVenueFees(venueId);

    res.json({ status: 'success', data: fees });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.addVenueFee = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const feeId = await Venue.addVenueFee(venueId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Fee added successfully',
      feeId
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateVenueFee = async (req, res) => {
  try {
    const { feeId } = req.params;
    const success = await Venue.updateVenueFee(feeId, req.body);

    if (!success) {
      return res.status(404).json({ message: 'Fee not found or no changes made' });
    }

    res.json({ message: 'Fee updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteVenueFee = async (req, res) => {
  try {
    const { feeId } = req.params;
    const success = await Venue.deleteVenueFee(feeId);

    if (!success) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    res.json({ message: 'Fee deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getVenueFeatures = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const features = await Venue.getVenueFeatures(venueId);

    res.json({ status: 'success', data: features });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.addVenueFeature = async (req, res) => {
  try {
    const { id: venueId } = req.params;
    const featureId = await Venue.addVenueFeature(venueId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Feature added successfully',
      featureId
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateVenueFeature = async (req, res) => {
  try {
    const { featureId } = req.params;
    const success = await Venue.updateVenueFeature(featureId, req.body);

    if (!success) {
      return res.status(404).json({ message: 'Feature not found or no changes made' });
    }

    res.json({ message: 'Feature updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteVenueFeature = async (req, res) => {
  try {
    const { featureId } = req.params;
    const success = await Venue.deleteVenueFeature(featureId);

    if (!success) {
      return res.status(404).json({ message: 'Feature not found' });
    }

    res.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
