// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://burlington-deals-api.onrender.com', // Your Render backend URL
});

// Add a request interceptor to include the token if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
