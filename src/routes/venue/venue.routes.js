const express = require('express');
const router = express.Router();
const venueController = require('../../controllers/venue.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload');

// GET all venues
router.get('/', venueController.getVenues);

// GET my venues (for owners)
router.get('/my-venues', protect, venueController.getMyVenues);

// Image CRUD
router.put('/images/:imageId', protect, authorize('admin', 'owner'), venueController.updateVenueImage);
router.delete('/images/:imageId', protect, authorize('admin', 'owner'), venueController.deleteVenueImage);

// Rating CRUD
router.put('/ratings/:ratingId', protect, venueController.updateRating);
router.delete('/ratings/:ratingId', protect, venueController.deleteRating);

// Category CRUD
router.put('/categories/:categoryId', protect, authorize('admin', 'owner'), venueController.updateVenueCategory);
router.delete('/categories/:categoryId', protect, authorize('admin', 'owner'), venueController.deleteVenueCategory);

// Fee CRUD
router.put('/fees/:feeId', protect, authorize('admin', 'owner'), venueController.updateVenueFee);
router.delete('/fees/:feeId', protect, authorize('admin', 'owner'), venueController.deleteVenueFee);

// Feature CRUD
router.put('/features/:featureId', protect, authorize('admin', 'owner'), venueController.updateVenueFeature);
router.delete('/features/:featureId', protect, authorize('admin', 'owner'), venueController.deleteVenueFeature);

// GET images for a venue
router.get('/:id/images', venueController.getVenueImages);

// GET ratings/categories/fees/features for a venue
router.get('/:id/ratings', venueController.getVenueRatings);
router.get('/:id/categories', venueController.getVenueCategories);
router.get('/:id/fees', venueController.getVenueFees);
router.get('/:id/features', venueController.getVenueFeatures);

// GET venue by ID
router.get('/:id', venueController.getVenueById);

// POST create a venue (Admin or Owner)
router.post('/', protect, authorize('admin', 'owner'), venueController.createVenue);

// POST add image to a venue (Authenticated users)
router.post('/:id/images', protect, upload.single('image'), venueController.addVenueImage);

// POST add rating to a venue (Authenticated)
router.post('/:id/rate', protect, venueController.addRating);

// POST add category/fee/feature to a venue
router.post('/:id/categories', protect, authorize('admin', 'owner'), venueController.addVenueCategory);
router.post('/:id/fees', protect, authorize('admin', 'owner'), venueController.addVenueFee);
router.post('/:id/features', protect, authorize('admin', 'owner'), venueController.addVenueFeature);

// PUT update a venue (Admin only)
router.put('/:id', protect, authorize('admin'), venueController.updateVenue);

// DELETE a venue (Admin only)
router.delete('/:id', protect, authorize('admin'), venueController.deleteVenue);

// PATCH update a venue (Admin only)
router.patch('/:id', protect, authorize('admin'), venueController.updateVenue);

module.exports = router;
