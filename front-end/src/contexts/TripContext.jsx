// Trip context for managing trip-related state
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { tripAPI, apiUtils } from '../services/api.js';

// Initial state
const initialState = {
  trips: [],
  currentTrip: null,
  searchResults: [],
  popularRoutes: [],
  busTypes: [],
  filterOptions: {
    priceRange: { minPrice: 0, maxPrice: 5000 },
    busTypes: [],
    companies: [],
    amenities: [],
  },
  isLoading: false,
  error: null,
  searchParams: {
    fromCity: '',
    toCity: '',
    departureDate: '',
    passengers: 1,
    busType: '',
    sortBy: 'departure_time',
    sortOrder: 'ASC',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// Action types
const TRIP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_TRIPS: 'SET_TRIPS',
  SET_CURRENT_TRIP: 'SET_CURRENT_TRIP',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_POPULAR_ROUTES: 'SET_POPULAR_ROUTES',
  SET_BUS_TYPES: 'SET_BUS_TYPES',
  SET_ROUTE_FILTERS: 'SET_ROUTE_FILTERS',
  SET_SEARCH_PARAMS: 'SET_SEARCH_PARAMS',
  SET_PAGINATION: 'SET_PAGINATION',
  UPDATE_TRIP: 'UPDATE_TRIP',
  ADD_TRIP: 'ADD_TRIP',
  REMOVE_TRIP: 'REMOVE_TRIP',
};

// Reducer function
const tripReducer = (state, action) => {
  switch (action.type) {
    case TRIP_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case TRIP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case TRIP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case TRIP_ACTIONS.SET_TRIPS:
      return {
        ...state,
        trips: action.payload.trips,
        pagination: action.payload.pagination || state.pagination,
        isLoading: false,
        error: null,
      };

    case TRIP_ACTIONS.SET_CURRENT_TRIP:
      return {
        ...state,
        currentTrip: { ...action.payload, seatDetails: null },
        isLoading: false,
        error: null,
      };
    
    case TRIP_ACTIONS.SET_ROUTE_FILTERS:
      return {
        ...state,
        filterOptions: action.payload,
        isLoading: false,
        error: null,
      };  

    case TRIP_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.trips,
        isLoading: false,
        error: null,
      };

    case TRIP_ACTIONS.SET_POPULAR_ROUTES:
      return {
        ...state,
        popularRoutes: action.payload,
        isLoading: false,
        error: null,
      };

    case TRIP_ACTIONS.SET_BUS_TYPES:
      return {
        ...state,
        busTypes: action.payload,
        isLoading: false,
        error: null,
      };

    case TRIP_ACTIONS.SET_SEARCH_PARAMS:
      return {
        ...state,
        searchParams: { ...state.searchParams, ...action.payload },
      };

    case TRIP_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case TRIP_ACTIONS.UPDATE_TRIP:
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.id === action.payload.id ? action.payload : trip
        ),
        currentTrip: state.currentTrip?.id === action.payload.id ? action.payload : state.currentTrip,
        searchResults: state.searchResults.map(trip =>
          trip.id === action.payload.id ? action.payload : trip
        ),
      };

    case TRIP_ACTIONS.ADD_TRIP:
      return {
        ...state,
        trips: [action.payload, ...state.trips],
      };

    case TRIP_ACTIONS.REMOVE_TRIP:
      return {
        ...state,
        trips: state.trips.filter(trip => trip.id !== action.payload),
        currentTrip: state.currentTrip?.id === action.payload ? null : state.currentTrip,
        searchResults: state.searchResults.filter(trip => trip.id !== action.payload),
      };

    default:
      return state;
  }
};

// Create context
const TripContext = createContext();

// Trip provider component
export const TripProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  // Search trips
  const searchTrips = useCallback(async (searchParams) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.searchTrips(searchParams);
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.SET_SEARCH_RESULTS,
          payload: {
            trips: response.data.trips,
            searchParams: response.data.searchParams,
          },
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  // Get Routes 
  const getRouteFilters = useCallback(async (fromCity, toCity) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });

      const response = await tripAPI.getRouteFilters(fromCity, toCity);

      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.SET_ROUTE_FILTERS,
          payload: response.data,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get route filters');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  // Get trip by ID
  const getTripById = useCallback(async (id) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.getTripById(id);
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.SET_CURRENT_TRIP,
          payload: response.data.trip,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get trip');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  // Get seat detail
  const fetchSeatDetails = useCallback(async (tripId) => {
    try {
        dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
        const response = await tripAPI.getTripSeatDetails(tripId);
        if (response.success) {
            dispatch({ 
                type: TRIP_ACTIONS.SET_CURRENT_TRIP, 
                payload: { ...state.currentTrip, seatDetails: response.data } 
            });
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        // ... handle error
    }
}, [state.currentTrip]);

  // Get all trips
  const getAllTrips = useCallback(async (page = 1, limit = 20) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.getAllTrips(page, limit);
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.SET_TRIPS,
          payload: {
            trips: response.data.trips,
            pagination: response.data.pagination,
          },
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get trips');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  // Get popular routes
  const getPopularRoutes = useCallback(async (limit = 10) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.getPopularRoutes(limit);
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.SET_POPULAR_ROUTES,
          payload: response.data.routes,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get popular routes');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  // Get bus types
  const getBusTypes = useCallback(async () => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.getBusTypes();
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.SET_BUS_TYPES,
          payload: response.data.busTypes,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get bus types');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  // Check seat availability
  const checkSeatAvailability = useCallback(async (tripId, requiredSeats = 1) => {
    try {
      const response = await tripAPI.checkSeatAvailability(tripId, requiredSeats);
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, error: errorData };
    }
  },[]);

  // Admin functions
  const createTrip = useCallback(async (tripData) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.createTrip(tripData);
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.ADD_TRIP,
          payload: response.data.trip,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create trip');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  const updateTrip = useCallback(async (id, tripData) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.updateTrip(id, tripData);
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.UPDATE_TRIP,
          payload: response.data.trip,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update trip');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  const deactivateTrip = useCallback(async (id) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      
      const response = await tripAPI.deactivateTrip(id);
      
      if (response.success) {
        dispatch({
          type: TRIP_ACTIONS.UPDATE_TRIP,
          payload: response.data.trip,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to deactivate trip');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  },[]);

  // Update search parameters
  const updateSearchParams = (params) => {
    dispatch({
      type: TRIP_ACTIONS.SET_SEARCH_PARAMS,
      payload: params,
    });
  };

  // Clear search results
  const clearSearchResults = () => {
    dispatch({
      type: TRIP_ACTIONS.SET_SEARCH_RESULTS,
      payload: { trips: [] },
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: TRIP_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    searchTrips,
    getTripById,
    getAllTrips,
    getPopularRoutes,
    getBusTypes,
    getRouteFilters,
    checkSeatAvailability,
    createTrip,
    updateTrip,
    fetchSeatDetails,
    deactivateTrip,
    updateSearchParams,
    clearSearchResults,
    clearError,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

// Custom hook to use trip context
export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export default TripContext;
