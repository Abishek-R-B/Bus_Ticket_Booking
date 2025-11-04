import Seat from '../models/Seat.js';
import { Trip } from '../models/Trip.js'; 

// Fetch all seats for a specific trip
export const getSeatsForBus = async (req, res) => {
  try {
    const { fromCity, toCity, busId } = req.query;

    // Fetch tripId automatically
    const trip = await Trip.findOne({
      where: {
        fromCity,
        toCity,
        busId
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found for given route/bus' });
    }

    const seats = await Seat.findAll({ where: { tripId: trip.id } });

    return res.status(200).json({ tripId: trip.id, seats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return res.status(500).json({ message: 'Failed to load seats' });
  }
};

// Book one or more seats for a given trip
export const bookSeats = async (req, res) => {
  try {
    const { fromCity, toCity, busId, seatNumbers, userId } = req.body;

    if (!fromCity || !toCity || !busId) {
      return res.status(400).json({ message: 'Trip details (busId, fromCity, toCity) are required' });
    }

    // Fetch tripId automatically
    const trip = await Trip.findOne({
      where: { fromCity, toCity, busId }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found for given route/bus' });
    }

    // Check if any requested seat is already booked
    const existingBooked = await Seat.findAll({
      where: {
        tripId: trip.id,
        seatNumber: seatNumbers,
        status: 'booked',
      },
    });

    if (existingBooked.length > 0) {
      const bookedSeatNumbers = existingBooked.map(s => s.seatNumber);
      return res.status(400).json({
        message: `Seats ${bookedSeatNumbers.join(', ')} are already booked.`,
      });
    }

    // Update all requested seats to "booked"
    await Seat.update(
      { status: 'booked' },
      {
        where: {
          tripId: trip.id,
          seatNumber: seatNumbers,
        },
      }
    );

    return res.status(200).json({
      message: 'Seats booked successfully!',
      tripId: trip.id,
      bookedSeats: seatNumbers,
    });
  } catch (error) {
    console.error('Error booking seats:', error);
    return res.status(500).json({ message: 'Failed to book seats' });
  }
};

// Initialize seats for a given trip
export const initializeSeats = async (req, res) => {
  try {
    const { fromCity, toCity, busId } = req.query;

    if (!fromCity || !toCity || !busId) {
      return res.status(400).json({ message: 'fromCity, toCity and busId are required' });
    }

    // Fetch tripId automatically
    const trip = await Trip.findOne({
      where: { fromCity, toCity, busId }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found for given route/bus' });
    }

    // Check existing seats
    const existing = await Seat.count({ where: { tripId: trip.id } });
    if (existing > 0) {
      return res.status(200).json({ message: 'Seats already initialized', count: existing });
    }

    const seatNumbers = [];
    for (let i = 1; i <= 19; i++) seatNumbers.push(`A${i}`);
    for (let i = 1; i <= 18; i++) seatNumbers.push(`B${i}`);

    const seatRows = seatNumbers.map(sn => ({
      seatNumber: sn,
      status: 'available',
      price: 0,
      tripId: trip.id,
    }));

    await Seat.bulkCreate(seatRows);

    return res.status(201).json({ message: 'Seats initialized', tripId: trip.id, count: seatRows.length });
  } catch (err) {
    console.error('initializeSeats error:', err);
    return res.status(500).json({ message: 'Failed to initialize seats' });
  }
};
