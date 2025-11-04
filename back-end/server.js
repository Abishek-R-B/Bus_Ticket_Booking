
import express from 'express';
import cors from 'cors';
import { dbPool, sequelize } from './src/configs/db.js';
import dotenv from 'dotenv';
dotenv.config();


// Import route handlers
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';
import seatRoutes from './src/routes/seatRoutes.js';


const app = express();
const PORT = process.env.PORT || 5002;

// Middleware Setup
app.use(cors()); 
app.use(express.json()); 

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/seats', seatRoutes);


// Error Handling Middleware 

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  // After server starts, connect Sequelize (traditional approach: connect after app is listening)
  (async () => {
    // Validate required DB env vars before attempting Sequelize connection
    const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
    if (!DB_DATABASE || !DB_USER || DB_PASSWORD === undefined) {
      console.warn('⚠️ Skipping Sequelize connect: missing DB environment variables. Set DB_DATABASE, DB_USER and DB_PASSWORD to enable DB connection.');
      return;
    }

    if (typeof DB_PASSWORD !== 'string') {
      console.warn('⚠️ Skipping Sequelize connect: DB_PASSWORD is not a string. Check your environment variables.');
      return;
    }

    try {
      await sequelize.authenticate();
      console.log('✅ Sequelize connected successfully.');

      // Sync models - adjust options as needed (use { alter: true } carefully in prod)
      await sequelize.sync();
      console.log('✅ Sequelize models synced.');
    } catch (err) {
      console.error('❌ Sequelize connection/sync error:', err);
    }
  })();
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    await sequelize.sync({ alter: true });
    console.log('✅ Models synced.');

    app.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
    });
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
})();