// src/services/dealService.js
import API from './api'; // Import the Axios instance with baseURL

const DEAL_API_URL = '/deals'; // Relative path

// Fetch approved deals (public view)
export const getApprovedDeals = async () => {
  try {
    const response = await API.get(`${DEAL_API_URL}/approved`);
    return response.data;
  } catch (error) {
    console.error('Error fetching approved deals:', error);
    throw error;
  }
};

// Fetch all deals (admin)
export const getAllDeals = async () => {
  try {
    const response = await API.get(`${DEAL_API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all deals:', error);
    throw error;
  }
};

// Create a new deal (any logged-in user can do this)
export const createDeal = async (dealData) => {
  try {
    const response = await API.post(`${DEAL_API_URL}/`, dealData);
    return response.data;
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
};

// Approve a deal (admin only)
export const approveDeal = async (dealId) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving deal:', error);
    throw error;
  }
};

// Reject a deal (admin only)
export const rejectDeal = async (dealId) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting deal:', error);
    throw error;
  }
};

// Promote a deal (admin only)
export const promoteDeal = async (dealId, promotedUntil) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/promote`, { promoted_until: promotedUntil });
    return response.data;
  } catch (error) {
    console.error('Error promoting deal:', error);
    throw error;
  }
};

// Unfeature a deal (admin only)
export const unfeatureDeal = async (dealId) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/unfeature`);
    return response.data;
  } catch (error) {
    console.error('Error unfeaturing deal:', error);
    throw error;
  }
};

// Update a deal (admin only)
export const updateDeal = async (dealId, updatedData) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};
// Delete a deal (admin only)
export const deleteDeal = async (dealId) => {
  try {
    const response = await API.delete(`${DEAL_API_URL}/${dealId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};