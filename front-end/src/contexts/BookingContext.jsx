// Booking context for managing booking-related state
import React, { createContext, useContext, useReducer } from 'react';
import { bookingAPI, apiUtils } from '../services/api.js';

// Initial state
const initialState = {
  bookings: [],
  currentBooking: null,
  bookingStats: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// Action types
const BOOKING_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_BOOKINGS: 'SET_BOOKINGS',
  SET_CURRENT_BOOKING: 'SET_CURRENT_BOOKING',
  SET_BOOKING_STATS: 'SET_BOOKING_STATS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  REMOVE_BOOKING: 'REMOVE_BOOKING',
};

// Reducer function
const bookingReducer = (state, action) => {
  switch (action.type) {
    case BOOKING_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case BOOKING_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case BOOKING_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case BOOKING_ACTIONS.SET_BOOKINGS:
      return {
        ...state,
        bookings: action.payload.bookings,
        pagination: action.payload.pagination || state.pagination,
        isLoading: false,
        error: null,
      };

    case BOOKING_ACTIONS.SET_CURRENT_BOOKING:
      return {
        ...state,
        currentBooking: action.payload,
        isLoading: false,
        error: null,
      };

    case BOOKING_ACTIONS.SET_BOOKING_STATS:
      return {
        ...state,
        bookingStats: action.payload,
        isLoading: false,
        error: null,
      };

    case BOOKING_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case BOOKING_ACTIONS.ADD_BOOKING:
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
      };

    case BOOKING_ACTIONS.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        ),
        currentBooking: state.currentBooking?.id === action.payload.id ? action.payload : state.currentBooking,
      };

    case BOOKING_ACTIONS.REMOVE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload),
        currentBooking: state.currentBooking?.id === action.payload ? null : state.currentBooking,
      };

    default:
      return state;
  }
};

// Create context
const BookingContext = createContext();

// Booking provider component
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Create booking
  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.ADD_BOOKING,
          payload: response.data.booking,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Booking creation failed');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Get booking by ID
  const getBookingById = async (id) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.getBookingById(id);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.SET_CURRENT_BOOKING,
          payload: response.data.booking,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get booking');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Get booking by booking ID
  const getBookingByBookingId = async (bookingId) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.getBookingByBookingId(bookingId);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.SET_CURRENT_BOOKING,
          payload: response.data.booking,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get booking');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Get user bookings
  const getUserBookings = async (page = 1, limit = 20) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.getUserBookings(page, limit);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.SET_BOOKINGS,
          payload: {
            bookings: response.data.bookings,
            pagination: response.data.pagination,
          },
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get bookings');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Get all bookings (admin)
  const getAllBookings = async (page = 1, limit = 20) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.getAllBookings(page, limit);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.SET_BOOKINGS,
          payload: {
            bookings: response.data.bookings,
            pagination: response.data.pagination,
          },
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get bookings');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Update booking status
  const updateBookingStatus = async (id, statusData) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.updateBookingStatus(id, statusData);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.UPDATE_BOOKING,
          payload: response.data.booking,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update booking status');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Cancel booking
  const cancelBooking = async (id, cancellationData) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.cancelBooking(id, cancellationData);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.UPDATE_BOOKING,
          payload: response.data.booking,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Get booking statistics
  const getBookingStats = async () => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.getBookingStats();
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.SET_BOOKING_STATS,
          payload: response.data.stats,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get booking statistics');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Get bookings by date range
  const getBookingsByDateRange = async (startDate, endDate) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: true });
      
      const response = await bookingAPI.getBookingsByDateRange(startDate, endDate);
      
      if (response.success) {
        dispatch({
          type: BOOKING_ACTIONS.SET_BOOKINGS,
          payload: {
            bookings: response.data.bookings,
            pagination: { page: 1, limit: response.data.bookings.length, total: response.data.bookings.length },
          },
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get bookings');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };

  // Check seat availability
  const checkSeatAvailability = async (tripId, seatNumbers) => {
    try {
      const response = await bookingAPI.checkSeatAvailability(tripId, seatNumbers);
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, error: errorData };
    }
  };

  // Update pagination
  const updatePagination = (pagination) => {
    dispatch({
      type: BOOKING_ACTIONS.SET_PAGINATION,
      payload: pagination,
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: BOOKING_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    createBooking,
    getBookingById,
    getBookingByBookingId,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    cancelBooking,
    getBookingStats,
    getBookingsByDateRange,
    checkSeatAvailability,
    updatePagination,
    clearError,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

// Custom hook to use booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
