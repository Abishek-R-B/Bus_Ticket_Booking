# Ticket Booking Platform - Backend API

A comprehensive Express.js backend API for a ticket booking platform with PostgreSQL database integration.

## Features

- **User Management**: Registration, authentication, profile management
- **Trip Management**: Bus routes, schedules, seat availability
- **Booking System**: Ticket reservations, payment processing, cancellations
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (User/Admin)
- **Validation**: Input validation using express-validator
- **Database**: PostgreSQL with optimized queries and indexes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Hashing**: bcrypt
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ticket_Booking_Platform/back-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/ticket_booking_db
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here
   JWT_EXPIRES_IN=24h
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb ticket_booking_db
   
   # Run schema
   psql -d ticket_booking_db -f database/schema.sql
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication & Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | User login | No |
| POST | `/api/users/refresh-token` | Refresh JWT token | No |
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| PUT | `/api/users/change-password` | Change password | Yes |
| PUT | `/api/users/deactivate` | Deactivate account | Yes |
| GET | `/api/users/all` | Get all users (Admin) | Yes (Admin) |

### Trips

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/trips/search` | Search trips | No |
| GET | `/api/trips/popular-routes` | Get popular routes | No |
| GET | `/api/trips/bus-types` | Get available bus types | No |
| GET | `/api/trips/:id` | Get trip by ID | Optional |
| GET | `/api/trips/:id/seat-availability` | Check seat availability | No |
| GET | `/api/trips` | Get all trips | Optional |
| POST | `/api/trips` | Create trip (Admin) | Yes (Admin) |
| PUT | `/api/trips/:id` | Update trip (Admin) | Yes (Admin) |
| PUT | `/api/trips/:id/deactivate` | Deactivate trip (Admin) | Yes (Admin) |
| PUT | `/api/trips/:id/seats` | Update available seats (Admin) | Yes (Admin) |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes |
| GET | `/api/bookings/stats` | Get booking statistics | Yes |
| GET | `/api/bookings/by-date-range` | Get bookings by date range | Yes |
| GET | `/api/bookings/check-seats` | Check seat availability | Yes |
| GET | `/api/bookings/booking/:bookingId` | Get booking by booking ID | Yes |
| GET | `/api/bookings/:id` | Get booking by ID | Yes |
| PUT | `/api/bookings/:id/status` | Update booking status | Yes |
| PUT | `/api/bookings/:id/cancel` | Cancel booking | Yes |
| GET | `/api/bookings` | Get all bookings (Admin) | Yes (Admin) |

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `first_name`, `last_name`
- `phone`, `date_of_birth`, `gender`
- `is_active`, `role`
- `created_at`, `updated_at`

### Trips Table
- `id` (Primary Key)
- `bus_id`, `bus_name`, `bus_number`
- `operator`, `from_city`, `to_city`
- `departure_time`, `arrival_time`
- `duration`, `distance`, `base_price`
- `total_seats`, `available_seats`
- `bus_type`, `amenities` (JSON)
- `is_active`
- `created_at`, `updated_at`

### Bookings Table
- `id` (Primary Key)
- `booking_id` (Unique, Human-readable)
- `user_id` (Foreign Key)
- `trip_id` (Foreign Key)
- `passenger_name`, `passenger_email`, `passenger_phone`
- `passenger_age`, `passenger_gender`
- `seat_numbers` (JSON Array)
- `total_amount`, `payment_status`, `payment_method`
- `payment_id`, `booking_status`
- `booking_date`, `travel_date`
- `cancellation_reason`, `refund_amount`
- `created_at`, `updated_at`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login/Register**: Returns access token and refresh token
2. **Access Token**: Short-lived (24h), used for API requests
3. **Refresh Token**: Long-lived (7d), used to get new access tokens
4. **Authorization Header**: `Bearer <access_token>`

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | null,
  "error": string | null
}
```

## Validation

Input validation is handled using express-validator:

- **Email**: Valid email format
- **Password**: Minimum 6 characters
- **Phone**: Valid mobile phone format
- **Required Fields**: Non-empty strings
- **Enums**: Predefined values for status fields

## Sample API Calls

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1995-05-15",
    "gender": "male"
  }'
```

### Search Trips
```bash
curl -X GET "http://localhost:5000/api/trips/search?fromCity=New York&toCity=Boston&departureDate=2024-01-15&passengers=2"
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "tripId": 1,
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "passengerPhone": "+1234567890",
    "passengerAge": 28,
    "passengerGender": "male",
    "seatNumbers": [1, 2],
    "totalAmount": 90.00,
    "paymentMethod": "credit_card",
    "travelDate": "2024-01-15"
  }'
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
# Run schema
psql -d ticket_booking_db -f database/schema.sql
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production PostgreSQL database
3. Set secure JWT secrets
4. Configure CORS for your frontend domain
5. Use a process manager like PM2
6. Set up SSL/TLS certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
