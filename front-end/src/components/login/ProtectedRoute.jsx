import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator while auth state is being determined
  if (loading) {
    // You can return a spinner or a loading component here
    console.log("PROTECTED ROUTE: Auth state is loading.");
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
    );
  }

  // If authenticated, render the child route (e.g., Checkout page)
  if (isAuthenticated) {
    console.log("PROTECTED ROUTE: User is authenticated. Allowing access.");
    return <Outlet />; // <Outlet /> renders the nested route component
  }
  
  // If not authenticated, redirect to the login page
  console.log("PROTECTED ROUTE: User is NOT authenticated. REDIRECTING to /login.");
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;