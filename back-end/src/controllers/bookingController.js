// Booking controller for ticket reservations and payments
import { body, query, validationResult } from 'express-validator';
import { Booking } from '../models/booking.js';
import { Trip } from '../models/trip.js';

// Validation rules
export const createBookingValidation = [
  body('tripId').isInt().withMessage('Valid trip ID is required'),
  body('passengerName').trim().notEmpty().withMessage('Passenger name is required'),
  body('passengerEmail').isEmail().normalizeEmail().withMessage('Valid passenger email is required'),
  body('passengerPhone').isMobilePhone().withMessage('Valid passenger phone is required'),
  body('passengerAge').isInt({ min: 1, max: 120 }).withMessage('Valid passenger age is required'),
  body('passengerGender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('seatNumbers').isArray({ min: 1 }).withMessage('At least one seat number is required'),
  body('seatNumbers.*').isInt({ min: 1 }).withMessage('Valid seat numbers are required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet']).withMessage('Valid payment method is required'),
  body('travelDate').isISO8601().withMessage('Valid travel date is required')
];

export const updateBookingStatusValidation = [
  body('status').isIn(['confirmed', 'cancelled', 'pending', 'completed']).withMessage('Valid status is required'),
  body('paymentStatus').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Valid payment status is required'),
  body('paymentId').optional().trim().notEmpty().withMessage('Payment ID cannot be empty'),
  body('cancellationReason').optional().trim().notEmpty().withMessage('Cancellation reason cannot be empty'),
  body('refundAmount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be a positive number')
];

export const cancelBookingValidation = [
  body('cancellationReason').trim().notEmpty().withMessage('Cancellation reason is required'),
  body('refundAmount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be a positive number')
];

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      tripId,
      passengerName,
      passengerEmail,
      passengerPhone,
      passengerAge,
      passengerGender,
      seatNumbers,
      totalAmount,
      paymentMethod,
      travelDate
    } = req.body;

    const userId = req.user.id;

    // Check if trip exists and is active
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check seat availability
    const seatAvailability = await Booking.checkSeatAvailability(tripId, seatNumbers);
    if (!seatAvailability.available) {
      return res.status(400).json({
        success: false,
        message: 'Selected seats are not available',
        data: {
          conflictingSeats: seatAvailability.conflictingSeats
        }
      });
    }

    // Check if trip has enough seats
    const hasEnoughSeats = await Trip.hasEnoughSeats(tripId, seatNumbers.length);
    if (!hasEnoughSeats) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      tripId,
      passengerName,
      passengerEmail,
      passengerPhone,
      passengerAge,
      passengerGender,
      seatNumbers,
      totalAmount,
      paymentMethod,
      travelDate
    });

    // Update available seats
    await Trip.updateAvailableSeats(tripId, -seatNumbers.length);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: error.message
    });
  }
};

// Get booking by booking ID
export const getBookingByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const bookingDetails = await Booking.getBookingWithDetails(bookingId);

    if (!bookingDetails) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (req.user.role !== 'admin' && bookingDetails.booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: bookingDetails
    });
  } catch (error) {
    console.error('Get booking by booking ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: error.message
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    const bookings = await Booking.getByUserId(userId, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: bookings.length
        }
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const bookings = await Booking.getAllBookings(parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: bookings.length
        }
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const booking = await Booking.updateStatus(id, updateData.status, updateData);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { cancellationReason, refundAmount = 0 } = req.body;

    // Get booking details
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (!['confirmed', 'pending'].includes(booking.bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Cancel booking
    const cancelledBooking = await Booking.cancel(id, cancellationReason, refundAmount);
    if (!cancelledBooking) {
      return res.status(400).json({
        success: false,
        message: 'Failed to cancel booking'
      });
    }

    // Release seats back to trip
    try {
      const seatNumbers = JSON.parse(booking.seatNumbers);
      await Trip.updateAvailableSeats(booking.tripId, seatNumbers.length);
    } catch (parseError) {
      console.warn('Error parsing seat numbers for cancellation:', parseError);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking: cancelledBooking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user.id;
    const stats = await Booking.getBookingStats(userId);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking statistics',
      error: error.message
    });
  }
};

// Get bookings by date range
export const getBookingsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.role === 'admin' ? null : req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const bookings = await Booking.getBookingsByDateRange(startDate, endDate, userId);

    res.json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    console.error('Get bookings by date range error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
};

// Check seat availability
export const checkSeatAvailability = async (req, res) => {
  try {
    const { tripId, seatNumbers } = req.query;

    if (!tripId || !seatNumbers) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID and seat numbers are required'
      });
    }

    let seatNumbersArray;
    try {
      seatNumbersArray = JSON.parse(seatNumbers);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seat numbers format'
      });
    }
    const availability = await Booking.checkSeatAvailability(tripId, seatNumbersArray);

    res.json({
      success: true,
      data: {
        tripId,
        seatNumbers: seatNumbersArray,
        available: availability.available,
        conflictingSeats: availability.conflictingSeats
      }
    });
  } catch (error) {
    console.error('Check seat availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check seat availability',
      error: error.message
    });
  }
};