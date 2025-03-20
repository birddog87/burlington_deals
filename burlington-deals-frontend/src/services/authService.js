// src/services/authService.js
import API from './api'; // Axios instance with baseURL

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// Register User
export const registerUser = async (email, password, displayName) => {
  try {
    const response = await API.post('/auth/register', { email, password, display_name: displayName });
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error;
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await API.post('/auth/forgot', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot Password Error:', error);
    throw error;
  }
};

// Reset Password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await API.post('/auth/reset', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Reset Password Error:', error);
    throw error;
  }
};
