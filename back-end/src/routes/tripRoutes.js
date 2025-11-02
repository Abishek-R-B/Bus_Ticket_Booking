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
  checkSeatAvailability,
  updateAvailableSeats,
  createTripValidation,
  updateTripValidation,
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

// Protected routes (require authentication)
router.get('/', optionalAuth, getAllTrips);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createTripValidation, createTrip);
router.put('/:id', authenticateToken, requireAdmin, updateTripValidation, updateTrip);
router.put('/:id/deactivate', authenticateToken, requireAdmin, deactivateTrip);
router.put('/:id/seats', authenticateToken, requireAdmin, updateAvailableSeats);

export default router;