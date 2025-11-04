// API service for frontend-backend communication
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/users/refresh-token`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await api.put('/users/deactivate');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/users/refresh-token', { refreshToken });
    return response.data;
  },
};

// Trip API functions
export const tripAPI = {
  // Search trips
  searchTrips: async (searchParams) => {
    const response = await api.get('/trips/search', { params: searchParams });
    return response.data;
  },

  // Get Filter
  getRouteFilters: (fromCity, toCity) => {
    return api.get(`/trips/filters`, { params: { fromCity, toCity } });
  },

  // Get trip by ID
  getTripById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Get seat details
  getTripSeatDetails: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/seats`);
    return response.data; // Should return array of seat objects
  },

  // Get all trips
  getAllTrips: async (page = 1, limit = 20) => {
    const response = await api.get('/trips', { params: { page, limit } });
    return response.data;
  },

  // Get popular routes
  getPopularRoutes: async (limit = 10) => {
    const response = await api.get('/trips/popular-routes', { params: { limit } });
    return response.data;
  },

  // Get bus types
  getBusTypes: async () => {
    const response = await api.get('/trips/bus-types');
    return response.data;
  },

  // Check seat availability
  checkSeatAvailability: async (tripId, requiredSeats = 1) => {
    const response = await api.get(`/trips/${tripId}/seat-availability`, {
      params: { requiredSeats },
    });
    return response.data;
  },

  // Admin functions
  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  updateTrip: async (id, tripData) => {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  },

  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },

  deactivateTrip: async (id) => {
    const response = await api.put(`/trips/${id}/deactivate`);
    return response.data;
  },

  createSeatsForTrip: async (tripId) => {
    const response = await api.post(`/seats/init/${tripId}`);
    return response.data;
  },

  updateAvailableSeats: async (id, seatChange) => {
    const response = await api.put(`/trips/${id}/seats`, { seatChange });
    return response.data;
  },
};

// Booking API functions
export const bookingAPI = {
  // Create booking
  createBooking: async (bookingData) => {
    // bookingData should contain { tripId, seatNumbers, passengerDetails, etc. }
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Get booking by booking ID
  getBookingByBookingId: async (bookingId) => {
    const response = await api.get(`/bookings/booking/${bookingId}`);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (page = 1, limit = 20) => {
    const response = await api.get('/bookings/my-bookings', { params: { page, limit } });
    return response.data;
  },

  // Get all bookings (admin)
  getAllBookings: async (page = 1, limit = 20) => {
    const response = await api.get('/bookings', { params: { page, limit } });
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id, statusData) => {
    const response = await api.put(`/bookings/${id}/status`, statusData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, cancellationData) => {
    const response = await api.put(`/bookings/${id}/cancel`, cancellationData);
    return response.data;
  },

  // Get booking statistics
  getBookingStats: async () => {
    const response = await api.get('/bookings/stats');
    return response.data;
  },

  // Get bookings by date range
  getBookingsByDateRange: async (startDate, endDate) => {
    const response = await api.get('/bookings/by-date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Check seat availability
  checkSeatAvailability: async (tripId, seatNumbers) => {
    const response = await api.get('/bookings/check-seats', {
      params: { tripId, seatNumbers: JSON.stringify(seatNumbers) },
    });
    return response.data;
  },
};


// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        errors: error.response.data?.errors || [],
        status: error.response.status,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        errors: [],
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        errors: [],
        status: 0,
      };
    }
  },

  // Set auth tokens
  setAuthTokens: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Clear auth tokens
  clearAuthTokens: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Set current user in localStorage
  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

export default api;
