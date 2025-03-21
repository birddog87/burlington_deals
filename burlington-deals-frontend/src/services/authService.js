// src/services/authService.js
import API from './api';

const AUTH_API_URL = '/auth'; // Relative path like dealService uses

export const loginUser = async (email, password) => {
  try {
    const response = await API.post(`${AUTH_API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

export const registerUser = async (email, password, displayName) => {
  try {
    const response = await API.post(`${AUTH_API_URL}/register`, { email, password, display_name: displayName });
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await API.post(`${AUTH_API_URL}/forgot`, { email });
    return response.data;
  } catch (error) {
    console.error('Forgot Password Error:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await API.post(`${AUTH_API_URL}/reset`, { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Reset Password Error:', error);
    throw error;
  }
};