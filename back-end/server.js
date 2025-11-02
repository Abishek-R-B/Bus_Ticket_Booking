
import express from 'express';
import cors from 'cors';
import { dbPool } from './src/configs/db.js';
import 'dotenv/config';

// Import route handlers
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';

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


// Error Handling Middleware 

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});