// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp < currentTime || decoded.role !== 'admin') {
      // Token expired or not an admin
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    // Invalid token
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
