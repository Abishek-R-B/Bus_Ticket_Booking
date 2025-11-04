// back-end/models/Seat.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';


const Seat = sequelize.define('Seat', {
  // Assuming 'seats' is the table name
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'blocked'),
    allowNull: false,
    defaultValue: 'available',
  },
  seatType: {
    type: DataTypes.ENUM('regular', 'sleeper', 'semi-sleeper'),
    allowNull: false,
    defaultValue: 'regular',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  bookedBy: { // Corresponds to booked_by in your schema
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'seats',
  timestamps: true // Sequelize will manage createdAt and updatedAt
});

export default Seat;
