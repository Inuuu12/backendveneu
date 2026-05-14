const Booking = require('../models/booking.model');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      venue_id,
      booking_date,
      start_time,
      end_time,
      duration_hours,
      note,
      adult_guests,
      child_guests,
      total_price,
      payment_status,
      payment_method
    } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!venue_id || !booking_date || !start_time || !end_time || !duration_hours) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: venue_id, booking_date, start_time, end_time, duration_hours'
      });
    }

    const bookingId = await Booking.createBooking({
      venue_id,
      user_id,
      booking_date,
      start_time,
      end_time,
      duration_hours,
      note,
      adult_guests,
      child_guests,
      total_price,
      payment_status,
      payment_method
    });

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      bookingId
    });
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings/all
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllBookings();

    res.json({
      status: 'success',
      data: bookings
    });
  } catch (error) {
    console.error('getAllBookings error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get my bookings (current user)
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookings = await Booking.getUserBookings(user_id);

    res.json({
      status: 'success',
      data: bookings
    });
  } catch (error) {
    console.error('getMyBookings error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get bookings for a specific venue
// @route   GET /api/bookings?venueId=
// @access  Private (admin or venue owner)
exports.getVenueBookings = async (req, res) => {
  try {
    const { venueId } = req.query;

    if (!venueId) {
      return res.status(400).json({
        status: 'error',
        message: 'venueId query parameter is required'
      });
    }

    // Check if user is admin or owner of the venue
    if (req.user.role !== 'admin') {
      const Venue = require('../models/venue.model');
      const venue = await Venue.getVenueById(venueId);
      
      if (!venue || venue.owner_id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to view bookings for this venue'
        });
      }
    }

    const bookings = await Booking.getVenueBookings(venueId);

    res.json({
      status: 'success',
      data: bookings
    });
  } catch (error) {
    console.error('getVenueBookings error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get booking detail
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    res.json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    console.error('getBookingDetail error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update booking status (admin only)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be: pending, confirmed, or cancelled'
      });
    }

    const success = await Booking.updateBookingStatus(id, status);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update booking data
// @route   PATCH /api/bookings/:id
// @access  Private/Admin
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Booking.updateBooking(id, req.body);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found or no changes made'
      });
    }

    res.json({
      status: 'success',
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('updateBooking error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update payment status
// @route   PATCH /api/bookings/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;

    if (!['pending', 'paid', 'failed'].includes(payment_status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payment_status. Must be: pending, paid, or failed'
      });
    }

    const success = await Booking.updatePaymentStatus(id, payment_status, payment_method);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('updatePaymentStatus error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Only owner or admin can cancel
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this booking'
      });
    }

    const success = await Booking.cancelBooking(id);

    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to cancel booking'
      });
    }

    res.json({
      status: 'success',
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('cancelBooking error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Booking.deleteBooking(id);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('deleteBooking error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Check availability for time slot
// @route   GET /api/bookings/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { venue_id, booking_date, start_time, end_time } = req.query;

    if (!venue_id || !booking_date || !start_time || !end_time) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: venue_id, booking_date, start_time, end_time'
      });
    }

    const available = await Booking.checkAvailability(venue_id, booking_date, start_time, end_time);

    res.json({
      status: 'success',
      available
    });
  } catch (error) {
    console.error('checkAvailability error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
