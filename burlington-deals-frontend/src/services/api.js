// src/services/api.js
import axios from 'axios';

// Use the environment variable if available; otherwise default to the Render API URL
const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://burlington-deals-api.onrender.com/api';

const API = axios.create({
  baseURL, // Now using the full API URL with /api
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
