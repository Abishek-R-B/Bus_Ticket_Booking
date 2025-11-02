// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { authAPI, apiUtils } from "../services/api.js";

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return { ...state, isLoading: true, error: null };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return { ...state, user: action.payload, error: null };

    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth once
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      const user = apiUtils.getCurrentUser();

      if (token && user) {
        try {
          const response = await authAPI.getProfile();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: response.data.user, token, refreshToken },
          });
        } catch {
          apiUtils.clearAuthTokens();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        apiUtils.setAuthTokens(token, refreshToken);
        apiUtils.setCurrentUser(user);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token, refreshToken },
        });
        return { success: true };
      }
      throw new Error("Login failed");
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorData });
      return { success: false, error: errorData };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        apiUtils.setAuthTokens(token, refreshToken);
        apiUtils.setCurrentUser(user);
        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: { user, token, refreshToken },
        });
        return { success: true };
      }
      throw new Error("Registration failed");
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      dispatch({ type: AUTH_ACTIONS.REGISTER_FAILURE, payload: errorData });
      return { success: false, error: errorData };
    }
  }, []);

  const logout = useCallback(() => {
    apiUtils.clearAuthTokens();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError,
    }),
    [state, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
