

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    console.log('GUEST ROUTE: Auth state is loading. Showing nothing.');
    return <div>Loading Auth...</div>;
  }

  if (isAuthenticated) {
    console.log('GUEST ROUTE: User is authenticated. REDIRECTING to /.');
    return <Navigate to="/" replace />;
  }

  console.log('GUEST ROUTE: User is NOT authenticated. Showing the login/register page.');
  return <Outlet />;
};

export default GuestRoute;