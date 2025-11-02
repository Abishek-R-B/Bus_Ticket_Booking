# Backend Setup Guide

## Issues Found and Fixed ✅

1. **Missing imports** - Fixed missing `query` import in userController.js
2. **JSON parsing errors** - Added error handling for JSON.parse operations
3. **Environment variables** - Missing DATABASE_URL and JWT_REFRESH_SECRET

## Quick Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your database credentials
```

**Required .env variables:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/ticket_booking_db
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here
PORT=5000
NODE_ENV=development
```

### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb ticket_booking_db

# Run schema
psql -d ticket_booking_db -f database/schema.sql
```

**Option B: Using the initialization script**
```bash
# Make sure DATABASE_URL is set in .env first
npm run init:db
```

### 4. Test the Setup

```bash
# Test database connection
npm run test:db

# Test API endpoints (start server first)
npm run dev
# In another terminal:
npm run test:api
```

## Database Schema

The database includes:
- **users** table - User authentication and profiles
- **trips** table - Bus routes and schedules  
- **bookings** table - Ticket reservations and payments
- **Indexes** for optimal performance
- **Sample data** for testing

## Sample Data Included

- **Admin user**: admin@ticketbooking.com / password123
- **Test user**: user@example.com / password123
- **Sample trips**: New York ↔ Boston, Los Angeles ↔ San Francisco, etc.

## API Endpoints

Once running, the API will be available at `http://localhost:5000`:

- `GET /health` - Health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/trips/search` - Search trips
- `POST /api/bookings` - Create booking
- And many more...

## Troubleshooting

### Database Connection Issues
1. Make sure PostgreSQL is running
2. Check DATABASE_URL format: `postgresql://user:pass@host:port/dbname`
3. Verify database exists and user has permissions

### Port Already in Use
```bash
# Kill process using port 5000
npx kill-port 5000

# Or change PORT in .env file
```

### Missing Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Commands

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run test:db      # Test database connection
npm run test:api     # Test API endpoints
npm run init:db      # Initialize database with schema
```

## Next Steps

1. Set up your .env file with database credentials
2. Initialize the database
3. Start the development server
4. Test the API endpoints
5. Connect your frontend to the backend API

The backend is now ready to work with your React frontend! 🚀
