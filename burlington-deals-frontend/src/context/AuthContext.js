// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: null,
  });

  // Protected routes that should redirect to login if token is invalid
  const protectedRoutes = [
    '/admin', 
    '/admin/deals', 
    '/admin/users', 
    '/add-deal'
  ];

  const isProtectedRoute = () => {
    return protectedRoutes.some(route => location.pathname.startsWith(route));
  };

  useEffect(() => {
    if (auth.token) {
      try {
        const decoded = jwtDecode(auth.token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          setAuth(prev => ({
            ...prev,
            user: {
              user_id: decoded.user_id,
              email: decoded.email,
              role: decoded.role,
            },
          }));
        } else {
          // Token expired
          silentLogout();
          
          // Only redirect if on a protected route
          if (isProtectedRoute()) {
            navigate('/login');
          }
        }
      } catch (err) {
        // Invalid token
        silentLogout();
        
        // Only redirect if on a protected route
        if (isProtectedRoute()) {
          navigate('/login');
        }
      }
    }
  }, [auth.token, location.pathname]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setAuth({
      token,
      user: {
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  };

  // Regular logout (user-initiated) - always redirects
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
    navigate('/login');
  };

  // Silent logout (expired token) - doesn't redirect unless needed
  const silentLogout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};