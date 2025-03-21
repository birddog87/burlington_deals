// src/services/api.js
import axios from 'axios';

// Always use the remote API URL directly
const API = axios.create({
  baseURL: 'https://burlington-deals-api.onrender.com/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
