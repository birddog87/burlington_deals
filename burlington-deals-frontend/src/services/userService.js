// src/services/userService.js
import API from './api'; // Axios instance with baseURL and interceptors

const USER_API_URL = '/admin/users';

export const getAllUsers = async () => {
  try {
    const response = await API.get(`${USER_API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await API.put(`${USER_API_URL}/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
