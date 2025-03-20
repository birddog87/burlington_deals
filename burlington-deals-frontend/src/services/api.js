// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://burlington-deals-api-e657ab9d4b71.herokuapp.com/api', // Your Heroku backend URL
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
