// Booking routes for ticket reservations and payments
import express from 'express';
import {
  createBooking,
  getBookingById,
  getBookingByBookingId,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats,
  getBookingsByDateRange,
  checkSeatAvailability
} from '../controllers/bookingController.js';
import {
  createBookingValidation,
  updateBookingStatusValidation,
  cancelBookingValidation
} from '../controllers/bookingController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authenticateToken, createBookingValidation, createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);
router.get('/stats', authenticateToken, getBookingStats);
router.get('/by-date-range', authenticateToken, getBookingsByDateRange);
router.get('/check-seats', authenticateToken, checkSeatAvailability);
router.get('/booking/:bookingId', authenticateToken, getBookingByBookingId);
router.get('/:id', authenticateToken, getBookingById);
router.put('/:id/status', authenticateToken, updateBookingStatusValidation, updateBookingStatus);
router.put('/:id/cancel', authenticateToken, cancelBookingValidation, cancelBooking);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllBookings);

export default router;