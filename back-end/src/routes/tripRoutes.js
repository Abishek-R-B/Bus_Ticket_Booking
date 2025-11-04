// Trip routes for bus routes and schedules
import express from 'express';
import {
  createTrip,
  getTripById,
  searchTrips,
  getRouteFilters,
  getAllTrips,
  updateTrip,
  deactivateTrip,
  getPopularRoutes,
  getTripSeatDetails,
  getBusTypes,
  getTrips,
  deleteTrip,
  checkSeatAvailability,
  updateAvailableSeats,
  createTripValidation,
  updateTripValidation,
  getSeatDetailsForTrip,
  searchTripsValidation
} from '../controllers/tripController.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/search', searchTripsValidation, searchTrips);
router.get('/filters', getRouteFilters);
router.get('/:id/seats', getTripSeatDetails);
router.get('/popular-routes', getPopularRoutes);
router.get('/bus-types', getBusTypes);
router.get('/:id', optionalAuth, getTripById);
router.get('/:id/seat-availability', checkSeatAvailability);
router.get('/trips/:tripId/seats', getSeatDetailsForTrip);

// Protected routes (require authentication)
router.get('/', optionalAuth, getAllTrips);

// Admin routes
router.get('/', authenticateToken, requireAdmin, updateTripValidation, getTrips);
router.post('/', authenticateToken, requireAdmin, createTripValidation, createTrip);
router.put('/:id', authenticateToken, requireAdmin, updateTripValidation, updateTrip);
router.put('/:id/deactivate', authenticateToken, requireAdmin, deactivateTrip);
router.put('/:id/seats', authenticateToken, requireAdmin, updateAvailableSeats);
router.delete('/:id', authenticateToken, requireAdmin, updateTripValidation, deleteTrip);

export default router;