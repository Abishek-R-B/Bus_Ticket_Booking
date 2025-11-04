// Trip controller for bus routes and schedules
import { body, query, validationResult } from 'express-validator';
import { Trip } from '../models/Trip.js';
import { Booking } from '../models/Booking.js';
import dbPool from '../configs/db.js';

// Validation rules
export const createTripValidation = [
  body('busId').notEmpty().withMessage('Bus ID is required'),
  body('busName').trim().notEmpty().withMessage('Bus name is required'),
  body('busNumber').trim().notEmpty().withMessage('Bus number is required'),
  body('operator').trim().notEmpty().withMessage('Operator is required'),
  body('fromCity').trim().notEmpty().withMessage('From city is required'),
  body('toCity').trim().notEmpty().withMessage('To city is required'),
  body('departureTime').isISO8601().withMessage('Valid departure time is required'),
  body('arrivalTime').isISO8601().withMessage('Valid arrival time is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('distance').isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),
  body('busType').trim().notEmpty().withMessage('Bus type is required')
];

export const updateTripValidation = [
  body('busName').optional().trim().notEmpty().withMessage('Bus name cannot be empty'),
  body('busNumber').optional().trim().notEmpty().withMessage('Bus number cannot be empty'),
  body('operator').optional().trim().notEmpty().withMessage('Operator cannot be empty'),
  body('fromCity').optional().trim().notEmpty().withMessage('From city cannot be empty'),
  body('toCity').optional().trim().notEmpty().withMessage('To city cannot be empty'),
  body('departureTime').optional().isISO8601().withMessage('Valid departure time is required'),
  body('arrivalTime').optional().isISO8601().withMessage('Valid arrival time is required'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('distance').optional().isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
  body('basePrice').optional().isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('totalSeats').optional().isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),
  body('busType').optional().trim().notEmpty().withMessage('Bus type cannot be empty')
];

export const searchTripsValidation = [
  query('fromCity').trim().notEmpty().withMessage('From city is required'),
  query('toCity').trim().notEmpty().withMessage('To city is required'),
  query('departureDate').optional().isISO8601().withMessage('Valid departure date is required'),
  query('passengers').optional().isInt({ min: 1, max: 6 }).withMessage('Passengers must be between 1 and 6'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
  query('busTypes').optional().isString().withMessage('busTypes must be a comma-separated string'),
  query('companies').optional().isString().withMessage('companies must be a comma-separated string'),
  query('amenities').optional().isString().withMessage('amenities must be a comma-separated string'),
  query('sortBy').optional().isIn(['departure_time', 'arrival_time', 'base_price', 'duration']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
];



// Get Trip Seat
export const getTripSeatDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the trip details to get the price
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Fetch the booked seats for this trip
    // This requires a new method in your Booking model
    const bookedSeats = await Booking.getBookedSeatsForTrip(id);

    res.json({
      success: true,
      data: {
        tripId: trip.id,
        basePrice: trip.basePrice,
        bookedSeats: bookedSeats, // This will be an array like ["A1", "B5", "E3"]
      },
    });

  } catch (error) {
    console.error('Get trip seat details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trip seat details',
      error: error.message,
    });
  }
};

// Get Seat Details For Trip
export const getSeatDetailsForTrip = async (req, res) => {
  const { tripId } = req.params;

  const trip = await query("SELECT basePrice, totalSeats FROM trips WHERE id = ?", [tripId]);
  const bookedSeats = await query("SELECT seat_number FROM bookings WHERE trip_id = ?", [tripId]);

  const totalSeats = trip[0].totalSeats || 40;
  const basePrice = trip[0].basePrice;

  const seats = Array.from({ length: totalSeats }, (_, i) => {
    const seat_number = `A${i + 1}`;
    return {
      seat_number,
      status: bookedSeats.some(b => b.seat_number === seat_number) ? "booked" : "available",
      price: Number(basePrice),
    };
  });

  res.json({ success: true, data: seats });
  // try {
  //   // 1. First, find which bus is assigned to this trip
  //   const tripResult = await dbPool.query('SELECT bus_id FROM trips WHERE id = $1', [tripId]);

  //   if (tripResult.rows.length === 0) {
  //     return res.status(404).json({ success: false, message: 'Trip not found.' });
  //   }
  //   const busId = tripResult.rows[0].bus_id;

  //   // 2. Now, fetch all seats for that bus
  //   const seatsResult = await dbPool.query(
  //     'SELECT seat_number, status, price FROM seats WHERE bus_id = $1 ORDER BY seat_number',
  //     [busId]
  //   );

  //   res.status(200).json({
  //     success: true,
  //     data: seatsResult.rows // This will be an array of seat objects
  //   });
  // } catch (error) {
  //   console.error('Error fetching seat details for trip:', error);
  //   res.status(500).json({ success: false, message: 'Failed to fetch seat details.' });
  // }
};

// Get Trips (Admin)
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll();
    return res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ message: 'Failed to load trips' });
  }
};
// Delete Trip (Admin)
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Trip.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({ message: 'Failed to delete trip' });
  }
};

// Create a new trip
export const createTrip = async (req, res) => {
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

    const tripData = req.body;

    // Prevent creating trips in the past (compare date part of departureTime)
    if (tripData.departureTime) {
      const departure = new Date(tripData.departureTime);
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      if (isNaN(departure.getTime()) || departure < todayStart) {
        return res.status(400).json({ success: false, message: 'Cannot create trip for a past date' });
      }
    }

    const trip = await Trip.create(tripData);

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trip',
      error: error.message
    });
  }
};

// Get trip by ID
export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trip',
      error: error.message
    });
  }
};

// Search trips
export const searchTrips = async (req, res) => {
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

    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    const searchParams = {
      fromCity: req.query.fromCity,
      toCity: req.query.toCity,
      departureDate: req.query.departureDate,
      passengers: req.query.passengers ? parseInt(req.query.passengers) : undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      busTypes: req.query.busTypes ? req.query.busTypes.split(',').filter(Boolean) : undefined,
      companies: req.query.companies ? req.query.companies.split(',').filter(Boolean) : undefined,
      amenities: req.query.amenities ? req.query.amenities.split(',').filter(Boolean) : undefined,
      sortBy: req.query.sortBy || 'departure_time',
      sortOrder: req.query.sortOrder || 'ASC',
    };

    const rawTrips = await Trip.searchTrips(searchParams);

    const formattedTrips = rawTrips.map(trip => {
      return {
        id: trip.id,
        busId: trip.bus_id,
        busName: trip.bus_name,
        busNumber: trip.bus_number,
        operator: trip.operator,
        fromCity: trip.from_city,
        toCity: trip.to_city,
        departureTime: trip.departure_time,
        arrivalTime: trip.arrival_time,
        duration: trip.duration,
        distance: trip.distance,
        basePrice: trip.base_price ? parseFloat(trip.base_price) : 0,
        totalSeats: trip.total_seats,
        availableSeats: trip.available_seats,
        busType: trip.bus_type,
        isActive: trip.is_active,
        createdAt: trip.created_at,
        updatedAt: trip.updated_at,
        amenities: trip.amenities ? trip.amenities.split(',').map(a => a.trim()) : [],
        rating: trip.rating ? parseFloat(trip.rating) : null,
      };
    });

    res.json({
      success: true,
      data: {
        trips: formattedTrips, // Send the newly formatted data
        searchParams: req.query,
        count: formattedTrips.length
      }
    });
  } catch (error) {
    console.error('Search trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search trips',
      error: error.message
    });
  }
};

// Get Route Filter

export const getRouteFilters = async (req, res) => {
  try {
    const { fromCity, toCity } = req.query;

    if (!fromCity || !toCity) {
      return res.status(400).json({
        success: false,
        message: 'fromCity and toCity query parameters are required'
      });
    }

    const filters = await Trip.getFiltersForRoute(fromCity, toCity);

    res.json({
      success: true,
      data: filters
    });

  } catch (error) {
    console.error('Get route filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get route filters',
      error: error.message
    });
  }
};

// Get all trips with pagination
export const getAllTrips = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const trips = await Trip.getAllTrips(parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: trips.length
        }
      }
    });
  } catch (error) {
    console.error('Get all trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trips',
      error: error.message
    });
  }
};

// Update trip
export const updateTrip = async (req, res) => {
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

    // Prevent updating to a past departure date
    if (updateData.departureTime) {
      const departure = new Date(updateData.departureTime);
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      if (isNaN(departure.getTime()) || departure < todayStart) {
        return res.status(400).json({ success: false, message: 'Cannot update trip to a past date' });
      }
    }

    const trip = await Trip.update(id, updateData);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip',
      error: error.message
    });
  }
};

// Deactivate trip
export const deactivateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.deactivate(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      message: 'Trip deactivated successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('Deactivate trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate trip',
      error: error.message
    });
  }
};

// Get popular routes
export const getPopularRoutes = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const routes = await Trip.getPopularRoutes(parseInt(limit));

    res.json({
      success: true,
      data: { routes }
    });
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get popular routes',
      error: error.message
    });
  }
};



// Get available bus types
export const getBusTypes = async (req, res) => {
  try {
    const busTypes = await Trip.getBusTypes();

    res.json({
      success: true,
      data: { busTypes }
    });
  } catch (error) {
    console.error('Get bus types error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bus types',
      error: error.message
    });
  }
};

// Check seat availability
export const checkSeatAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { requiredSeats = 1 } = req.query;

    const hasEnoughSeats = await Trip.hasEnoughSeats(id, parseInt(requiredSeats));

    res.json({
      success: true,
      data: {
        tripId: id,
        requiredSeats: parseInt(requiredSeats),
        available: hasEnoughSeats
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

// Update available seats (internal use)
export const updateAvailableSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatChange } = req.body;

    if (typeof seatChange !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Seat change must be a number'
      });
    }

    const trip = await Trip.updateAvailableSeats(id, seatChange);
    if (!trip) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update seats. Check if trip exists and has enough seats.'
      });
    }

    res.json({
      success: true,
      message: 'Seats updated successfully',
      data: { trip }
    });
  } catch (error) {
    console.error('Update available seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update available seats',
      error: error.message
    });
  }
};