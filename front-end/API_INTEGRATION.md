# Frontend-Backend API Integration

This document describes the complete integration between the frontend React application and the backend Node.js API.

## Overview

The frontend has been fully integrated with the backend API using:
- **Axios** for HTTP requests
- **React Context** for state management
- **JWT Authentication** with automatic token refresh
- **Error handling** and loading states

## API Service Structure

### Core API Service (`src/services/api.js`)

The main API service provides:
- Axios instance with base configuration
- Request/response interceptors for authentication
- Automatic token refresh on 401 errors
- Centralized error handling

### Context Providers

#### 1. AuthContext (`src/contexts/AuthContext.jsx`)
Manages user authentication state:
- Login/Register functionality
- Token management
- User profile updates
- Password changes
- Account deactivation

#### 2. TripContext (`src/contexts/TripContext.jsx`)
Manages trip-related operations:
- Search trips
- Get trip details
- Popular routes
- Bus types
- Seat availability

#### 3. BookingContext (`src/contexts/BookingContext.jsx`)
Manages booking operations:
- Create bookings
- Get user bookings
- Update booking status
- Cancel bookings
- Booking statistics

## API Endpoints Integration

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `PUT /api/users/deactivate` - Deactivate account
- `POST /api/users/refresh-token` - Refresh JWT token

### Trip Endpoints
- `GET /api/trips/search` - Search trips
- `GET /api/trips/:id` - Get trip by ID
- `GET /api/trips` - Get all trips
- `GET /api/trips/popular-routes` - Get popular routes
- `GET /api/trips/bus-types` - Get bus types
- `GET /api/trips/:id/seat-availability` - Check seat availability

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/stats` - Get booking statistics

## Component Updates

### Updated Components

1. **App.jsx**
   - Added context providers
   - Wrapped application with AuthProvider, TripProvider, and BookingProvider

2. **Login.jsx**
   - Integrated with AuthContext
   - Added form validation
   - Real-time error handling
   - Auto-redirect on successful login

3. **Navbar.jsx**
   - Dynamic user menu based on authentication state
   - User profile display
   - Logout functionality

4. **Search.jsx**
   - Integrated with TripContext
   - Real-time search functionality
   - Navigation to search results

5. **Ticket.jsx**
   - Displays search results from TripContext
   - Loading and error states
   - Empty state handling

6. **SearchResult.jsx**
   - Dynamic trip display
   - Pagination support
   - Trip selection and navigation

7. **Checkout.jsx**
   - Authentication protection
   - Trip data integration
   - Booking creation

8. **PassengerData.jsx**
   - Form validation
   - Booking creation integration
   - Payment method selection

9. **BookingStatus.jsx**
   - Dynamic trip information display
   - Real-time price calculation
   - Seat selection display

## Features Implemented

### Authentication
- ✅ User registration with validation
- ✅ User login with error handling
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ User profile management
- ✅ Logout functionality

### Trip Management
- ✅ Trip search with filters
- ✅ Real-time search results
- ✅ Trip details display
- ✅ Popular routes
- ✅ Bus types
- ✅ Seat availability checking

### Booking Management
- ✅ Booking creation
- ✅ Booking validation
- ✅ Payment method selection
- ✅ Booking status tracking
- ✅ User booking history

### UI/UX Improvements
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation
- ✅ Responsive design
- ✅ User feedback

## Usage Examples

### Using AuthContext
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Handle successful login
    }
  };
}
```

### Using TripContext
```jsx
import { useTrip } from '../contexts/TripContext';

function SearchComponent() {
  const { searchTrips, searchResults, isLoading } = useTrip();
  
  const handleSearch = async (searchParams) => {
    const result = await searchTrips(searchParams);
    if (result.success) {
      // Handle search results
    }
  };
}
```

### Using BookingContext
```jsx
import { useBooking } from '../contexts/BookingContext';

function BookingComponent() {
  const { createBooking, getUserBookings } = useBooking();
  
  const handleBooking = async (bookingData) => {
    const result = await createBooking(bookingData);
    if (result.success) {
      // Handle successful booking
    }
  };
}
```

## Error Handling

The API service includes comprehensive error handling:
- Network errors
- HTTP status errors
- Validation errors
- Authentication errors
- Automatic token refresh on 401 errors

## Testing

A test utility is provided in `src/utils/testApi.js` for testing API integration:

```javascript
import { testApiIntegration } from '../utils/testApi';

// Test all API endpoints
testApiIntegration();
```

## Environment Configuration

Make sure your backend is running on `http://localhost:5000` or update the base URL in `src/services/api.js`.

## Security Features

- JWT token authentication
- Automatic token refresh
- Secure password handling
- Input validation
- XSS protection
- CSRF protection

## Performance Optimizations

- Request/response interceptors
- Context-based state management
- Lazy loading of components
- Optimized re-renders
- Error boundary implementation

This integration provides a complete, production-ready connection between the frontend and backend, with proper error handling, authentication, and user experience features.
