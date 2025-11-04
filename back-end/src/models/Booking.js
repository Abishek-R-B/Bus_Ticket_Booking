// Booking model for ticket reservations and payments
import { query } from '../configs/db.js';
import { Trip } from './Trip.js';

export class Booking {
  constructor(bookingData) {
    this.id = bookingData.id;
    this.bookingId = bookingData.booking_id;
    this.userId = bookingData.user_id;
    this.tripId = bookingData.trip_id;
    this.passengerName = bookingData.passenger_name;
    this.passengerEmail = bookingData.passenger_email;
    this.passengerPhone = bookingData.passenger_phone;
    this.passengerAge = bookingData.passenger_age;
    this.passengerGender = bookingData.passenger_gender;
    this.seatNumbers = bookingData.seat_numbers;
    this.totalAmount = bookingData.total_amount;
    this.paymentStatus = bookingData.payment_status;
    this.paymentMethod = bookingData.payment_method;
    this.paymentId = bookingData.payment_id;
    this.bookingStatus = bookingData.booking_status;
    this.bookingDate = bookingData.booking_date;
    this.travelDate = bookingData.travel_date;
    this.cancellationReason = bookingData.cancellation_reason;
    this.refundAmount = bookingData.refund_amount;
    this.createdAt = bookingData.created_at;
    this.updatedAt = bookingData.updated_at;
  }

  // Create a new booking
  static async create(bookingData) {
    const {
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
    } = bookingData;

    // Generate unique booking ID
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Normalize seatNumbers to a clean array of strings
    const normalizedSeats = Array.isArray(seatNumbers)
      ? seatNumbers.map(s => String(s).trim()).filter(Boolean)
      : typeof seatNumbers === 'string'
        ? seatNumbers.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    // Always store seat numbers as valid JSON
    const seatNumbersJson = JSON.stringify(normalizedSeats);

    const queryText = `
      INSERT INTO bookings (
        booking_id, user_id, trip_id, passenger_name, passenger_email,
        passenger_phone, passenger_age, passenger_gender, seat_numbers,
        total_amount, payment_method, travel_date, booking_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const values = [
      bookingId,
      userId,
      tripId,
      passengerName,
      passengerEmail,
      passengerPhone,
      passengerAge,
      passengerGender,
      seatNumbersJson,
      totalAmount,
      paymentMethod,
      travelDate
    ];

    try {
      const result = await query(queryText, values);
      return new Booking(result.rows[0]);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Find booking by ID
  static async findById(id) {
    const queryText = 'SELECT * FROM bookings WHERE id = $1';
    try {
      const result = await query(queryText, [id]);
      return result.rows.length > 0 ? new Booking(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find booking by booking ID
  static async findByBookingId(bookingId) {
    const queryText = 'SELECT * FROM bookings WHERE booking_id = $1';
    try {
      const result = await query(queryText, [bookingId]);
      return result.rows.length > 0 ? new Booking(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get bookings by user ID
  static async getByUserId(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const queryText = `
      SELECT b.*, t.bus_name, t.bus_number, t.from_city, t.to_city, 
             t.departure_time, t.arrival_time
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    try {
      const result = await query(queryText, [userId, limit, offset]);
      return result.rows.map(row => ({
        ...new Booking(row),
        tripDetails: {
          busName: row.bus_name,
          busNumber: row.bus_number,
          fromCity: row.from_city,
          toCity: row.to_city,
          departureTime: row.departure_time,
          arrivalTime: row.arrival_time
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get all bookings with pagination
  static async getAllBookings(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const queryText = `
      SELECT b.*, t.bus_name, t.bus_number, t.from_city, t.to_city,
             u.first_name, u.last_name, u.email
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await query(queryText, [limit, offset]);
      return result.rows.map(row => ({
        ...new Booking(row),
        tripDetails: {
          busName: row.bus_name,
          busNumber: row.bus_number,
          fromCity: row.from_city,
          toCity: row.to_city
        },
        userDetails: {
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update booking status
  static async updateStatus(id, status, additionalData = {}) {
    const { paymentStatus, paymentId, cancellationReason, refundAmount } = additionalData;

    const queryText = `
      UPDATE bookings 
      SET booking_status = $1,
          payment_status = COALESCE($2, payment_status),
          payment_id = COALESCE($3, payment_id),
          cancellation_reason = COALESCE($4, cancellation_reason),
          refund_amount = COALESCE($5, refund_amount),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const values = [status, paymentStatus, paymentId, cancellationReason, refundAmount, id];

    try {
      const result = await query(queryText, values);
      return result.rows.length > 0 ? new Booking(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Cancel booking
  static async cancel(id, cancellationReason, refundAmount = 0) {
    const queryText = `
      UPDATE bookings 
      SET booking_status = 'cancelled',
          cancellation_reason = $1,
          refund_amount = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND booking_status IN ('confirmed', 'pending')
      RETURNING *
    `;

    try {
      const result = await query(queryText, [cancellationReason, refundAmount, id]);
      return result.rows.length > 0 ? new Booking(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get booking statistics
  static async getBookingStats(userId = null) {
    let queryText = `
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN booking_status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN booking_status = 'cancelled' THEN 1 END) as cancelled_bookings,
        COUNT(CASE WHEN booking_status = 'pending' THEN 1 END) as pending_bookings,
        SUM(CASE WHEN booking_status = 'confirmed' THEN total_amount ELSE 0 END) as total_revenue
      FROM bookings
    `;

    const values = [];

    if (userId) {
      queryText += ' WHERE user_id = $1';
      values.push(userId);
    }

    try {
      const result = await query(queryText, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get bookings by date range
  static async getBookingsByDateRange(startDate, endDate, userId = null) {
    let queryText = `
      SELECT b.*, t.bus_name, t.from_city, t.to_city, t.departure_time
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      WHERE b.travel_date BETWEEN $1 AND $2
    `;

    const values = [startDate, endDate];

    if (userId) {
      queryText += ' AND b.user_id = $3';
      values.push(userId);
    }

    queryText += ' ORDER BY b.travel_date, t.departure_time';

    try {
      const result = await query(queryText, values);
      return result.rows.map(row => ({
        ...new Booking(row),
        tripDetails: {
          busName: row.bus_name,
          fromCity: row.from_city,
          toCity: row.to_city,
          departureTime: row.departure_time
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  // Check if seats are available for booking
  static async checkSeatAvailability(tripId, seatNumbers, travelDate) {
    const queryText = `
    SELECT seat_numbers 
    FROM bookings 
    WHERE trip_id = $1 
    AND booking_status IN ('confirmed', 'pending')
    AND travel_date = $2
  `;

    try {
      const result = await query(queryText, [tripId, travelDate]);

      const bookedSeats = result.rows.flatMap(row => {
        try {
          // Try to parse JSON first
          const parsed = JSON.parse(row.seat_numbers);
          return Array.isArray(parsed)
            ? parsed.map(s => String(s).trim())
            : [];
        } catch {
          // Fallback if seat_numbers is a comma-separated string
          if (typeof row.seat_numbers === 'string') {
            return row.seat_numbers
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);
          }
          return [];
        }
      });

      const requestedSeats = Array.isArray(seatNumbers)
        ? seatNumbers.map(s => String(s).trim())
        : [String(seatNumbers).trim()];

      const conflictingSeats = requestedSeats.filter(seat =>
        bookedSeats.includes(seat)
      );

      return {
        available: conflictingSeats.length === 0,
        conflictingSeats
      };
    } catch (error) {
      console.error('Error in checkSeatAvailability:', error);
      throw error;
    }
  }

  // Get booked seats for trip
  static async getBookedSeatsForTrip(tripId) {
    const queryText = `
      SELECT seat_numbers 
      FROM bookings 
      WHERE trip_id = $1 
      AND booking_status IN ('confirmed', 'pending')
    `;
    try {
      const result = await query(queryText, [tripId]);
      const allBookedSeats = result.rows.flatMap(row => {
        try {
          return JSON.parse(row.seat_numbers);
        } catch (e) {
          console.error("Could not parse seat_numbers JSON from DB:", row.seat_numbers);
          return [];
        }
      });
      return allBookedSeats;
    } catch (error) {
      console.error(`Error fetching booked seats for trip ${tripId}:`, error);
      throw error;
    }
  }

  // Get booking with trip and user details
  static async getBookingWithDetails(bookingId) {
    const queryText = `
      SELECT b.*, t.*, u.first_name, u.last_name, u.email, u.phone
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      JOIN users u ON b.user_id = u.id
      WHERE b.booking_id = $1
    `;

    try {
      const result = await query(queryText, [bookingId]);
      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        booking: new Booking(row),
        trip: new Trip(row),
        user: {
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          phone: row.phone
        }
      };
    } catch (error) {
      throw error;
    }
  }
}
