import { query } from '../configs/db.js';

export default class Seat {
  constructor(seatData) {
    this.id = seatData.id;
    this.seatNumber = seatData.seat_number;
    this.status = seatData.status;
    this.seatType = seatData.seat_type;
    this.price = seatData.price;
    this.tripId = seatData.trip_id;
    this.bookedBy = seatData.booked_by;
    this.createdAt = seatData.created_at;
    this.updatedAt = seatData.updated_at;
  }

  /** Get all seats for a trip */
  static async findByTripId(tripId) {
    const text = `SELECT * FROM seats WHERE trip_id = $1 ORDER BY seat_number ASC`;
    try {
      const result = await query(text, [tripId]);
      return result.rows.map(row => new Seat(row));
    } catch (error) {
      console.error('Error fetching seats by trip ID:', error);
      throw error;
    }
  }

  /** Find seats by tripId and an array of seat numbers
   *  seatNumbers should be an array of strings (e.g. ['A1','A2'])
   */
  static async findByTripIdAndSeatNumbers(tripId, seatNumbers) {
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) return [];

    const text = `SELECT * FROM seats WHERE trip_id = $1 AND seat_number = ANY($2::text[]) ORDER BY seat_number ASC`;
    try {
      const result = await query(text, [tripId, seatNumbers]);
      return result.rows.map(row => new Seat(row));
    } catch (error) {
      console.error('Error fetching seats by trip ID and seat numbers:', error);
      throw error;
    }
  }

  /** Update statuses by tripId and seat numbers
   *  Ensures seats exist and are available before updating. Returns updated Seat instances.
   */
  static async updateStatusesBySeatNumbers(tripId, seatNumbers, status, bookedBy) {
    try {
      const seats = await this.findByTripIdAndSeatNumbers(tripId, seatNumbers);

      // Ensure all requested seat numbers exist
      const foundSeatNumbers = seats.map(s => String(s.seatNumber).trim());
      const missingSeats = seatNumbers.filter(s => !foundSeatNumbers.includes(s));
      if (missingSeats.length > 0) {
        throw new Error(`Seat(s) not found: ${missingSeats.join(', ')}`);
      }

      // Ensure all seats are available
      const notAvailable = seats.filter(s => !s.isAvailable());
      if (notAvailable.length > 0) {
        throw new Error(`Seat(s) ${notAvailable.map(s => s.seatNumber).join(', ')} are already booked or blocked.`);
      }

      const seatIds = seats.map(s => s.id);
      return await this.updateMultipleStatuses(seatIds, status, bookedBy);
    } catch (error) {
      console.error('Error updating seat statuses by seat numbers:', error);
      throw error;
    }
  }

  /** Find seat by ID */
  static async findById(id) {
    const text = `SELECT * FROM seats WHERE id = $1`;
    try {
      const result = await query(text, [id]);
      return result.rows.length ? new Seat(result.rows[0]) : null;
    } catch (error) {
      console.error('Error fetching seat by ID:', error);
      throw error;
    }
  }

  /** Create multiple seats (no transaction) */
  static async createBulk(tripId, seatConfigs) {
    const createdSeats = [];
    const insertText = `
      INSERT INTO seats (seat_number, status, seat_type, price, trip_id, created_at, updated_at)
      VALUES ($1, 'available', $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;

    try {
      for (const config of seatConfigs) {
        const values = [
          config.seatNumber,
          config.seatType,
          config.price,
          tripId
        ];
        const result = await query(insertText, values);
        createdSeats.push(new Seat(result.rows[0]));
      }
      return createdSeats;
    } catch (error) {
      console.error('Error creating bulk seats:', error);
      throw error;
    }
  }

  /** Update status of multiple seats */
  static async updateMultipleStatuses(seatIds, status, bookedBy) {
    try {
      // Check availability first
      const checkText = `SELECT id, status FROM seats WHERE id = ANY($1::int[])`;
      const { rows: seats } = await query(checkText, [seatIds]);

      if (seats.length !== seatIds.length) {
        throw new Error('One or more seats not found.');
      }

      const notAvailable = seats.filter(s => s.status !== 'available');
      if (notAvailable.length > 0) {
        throw new Error(`Seat(s) ${notAvailable.map(s => s.id).join(', ')} are already booked or blocked.`);
      }

      // Update all available seats
      const updateText = `
        UPDATE seats
        SET status = $1, booked_by = $2, updated_at = NOW()
        WHERE id = ANY($3::int[])
        RETURNING *;
      `;

      const { rows: updatedRows } = await query(updateText, [status, bookedBy, seatIds]);
      return updatedRows.map(row => new Seat(row));
    } catch (error) {
      console.error('Error updating multiple seat statuses:', error);
      throw error;
    }
  }

  /** Helper: is the seat available? */
  isAvailable() {
    return this.status === 'available';
  }

  /** Convert to plain JSON */
  toJSON() {
    return { ...this };
  }
}


// // back-end/models/Seat.js
// import { DataTypes } from 'sequelize';
// import { sequelize } from '../configs/db.js';


// const Seat = sequelize.define('Seat', {
//   // Assuming 'seats' is the table name
//   seatNumber: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.ENUM('available', 'booked', 'blocked'),
//     allowNull: false,
//     defaultValue: 'available',
//   },
//   seatType: {
//     type: DataTypes.ENUM('regular', 'sleeper', 'semi-sleeper'),
//     allowNull: false,
//     defaultValue: 'regular',
//   },
//   price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   tripId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'trips',
//       key: 'id',
//     },
//     onDelete: 'CASCADE',
//   },
//   bookedBy: { // Corresponds to booked_by in your schema
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   }
// }, {
//   tableName: 'seats',
//   timestamps: true // Sequelize will manage createdAt and updatedAt
// });

// export default Seat;
