// src/services/adminService.js
import API from './api';

// Fetch all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await API.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await API.put(`/admin/users/${userId}/role`, { role: newRole });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Toggle user active status (admin only)
export const toggleUserActive = async (userId) => {
  try {
    const response = await API.put(`/admin/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Error toggling user active status:', error);
    throw error;
  }
};
