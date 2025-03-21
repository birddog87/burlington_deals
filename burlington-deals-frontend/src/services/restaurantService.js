// src/services/restaurantService.js
import API from './api'; // Axios instance with baseURL

const RESTAURANT_API_URL = '/restaurants';

export const getAllRestaurants = async () => {
  try {
    const response = await API.get(`${RESTAURANT_API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

export const searchRestaurants = async (query) => {
  try {
    const response = await API.get(`${RESTAURANT_API_URL}/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
};

export const createRestaurant = async ({ name, address, city, province }) => {
  try {
    const response = await API.post(`${RESTAURANT_API_URL}`, {
      name,
      address,
      city,
      province,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};
