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

// Private/Admin - Get all bookings
router.get("/all", protect, authorize('admin'), bookingController.getAllBookings);

// Private - Get venue bookings (admin or owner of venue)
router.get("/", protect, bookingController.getVenueBookings);

// Private - Get booking detail
router.get("/:id", protect, bookingController.getBookingDetail);

// Private/Admin - Update booking status
router.patch("/:id/status", protect, authorize('admin'), bookingController.updateBookingStatus);

// Private/Admin - Update payment status
router.patch("/:id/payment", protect, authorize('admin'), bookingController.updatePaymentStatus);

// Private/Admin - Update booking
router.patch("/:id", protect, authorize('admin'), bookingController.updateBooking);

// Private - Cancel booking
router.patch("/:id/cancel", protect, bookingController.cancelBooking);

// Private/Admin - Delete booking
router.delete("/:id", protect, authorize('admin'), bookingController.deleteBooking);

module.exports = router;
