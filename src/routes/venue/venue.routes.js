const express = require('express');
const router = express.Router();
const venueController = require('../../controllers/venue.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload');

// GET all venues
router.get('/', venueController.getVenues);

// GET my venues (for owners)
router.get('/my-venues', protect, venueController.getMyVenues);

// GET images for a venue
router.get('/:id/images', venueController.getVenueImages);

// GET venue by ID
router.get('/:id', venueController.getVenueById);

// POST create a venue (Admin or Owner)
router.post('/', protect, authorize('admin', 'owner'), venueController.createVenue);

// POST add image to a venue (Authenticated users)
router.post('/:id/images', protect, upload.single('image'), venueController.addVenueImage);

// POST add rating to a venue (Authenticated)
router.post('/:id/rate', protect, venueController.addRating);

// PUT update a venue (Admin only)
router.put('/:id', protect, authorize('admin'), venueController.updateVenue);

// DELETE a venue (Admin only)
router.delete('/:id', protect, authorize('admin'), venueController.deleteVenue);

// PATCH update a venue (Admin only)
router.patch('/:id', protect, authorize('admin'), venueController.updateVenue);

module.exports = router;