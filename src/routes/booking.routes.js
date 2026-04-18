const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public - Check availability
router.get("/check-availability", bookingController.checkAvailability);

// Private - Create booking
router.post("/", protect, bookingController.createBooking);

// Private - Get my bookings
router.get("/my-bookings", protect, bookingController.getMyBookings);

// Private - Get venue bookings (admin or owner of venue)
router.get("/", protect, bookingController.getVenueBookings);

// Private - Get booking detail
router.get("/:id", protect, bookingController.getBookingDetail);

// Private/Admin - Update booking status
router.patch("/:id/status", protect, authorize('admin'), bookingController.updateBookingStatus);

// Private - Cancel booking
router.patch("/:id/cancel", protect, bookingController.cancelBooking);

module.exports = router;