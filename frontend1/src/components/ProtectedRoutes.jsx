import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore.getState();

  // If not authenticated or role is not allowed, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If user doesn't have the required role, redirect to a different page
    return <Navigate to="/" />;
  }

  return <Outlet />; // Render the nested routes if authenticated
};

export default ProtectedRoute;