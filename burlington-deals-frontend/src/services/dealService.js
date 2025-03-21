// src/services/dealService.js
import API from './api'; // Import the Axios instance with baseURL

const DEAL_API_URL = '/deals'; // Relative path (no /api needed)

export const getApprovedDeals = async () => {
  try {
    const response = await API.get(`${DEAL_API_URL}/approved`);
    return response.data;
  } catch (error) {
    console.error('Error fetching approved deals:', error);
    throw error;
  }
};

export const getAllDeals = async () => {
  try {
    const response = await API.get(`${DEAL_API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all deals:', error);
    throw error;
  }
};

export const createDeal = async (dealData) => {
  try {
    const response = await API.post(`${DEAL_API_URL}/`, dealData);
    return response.data;
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
};

export const approveDeal = async (dealId) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving deal:', error);
    throw error;
  }
};

export const rejectDeal = async (dealId) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting deal:', error);
    throw error;
  }
};

export const promoteDeal = async (dealId, promotedUntil) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/promote`, { promoted_until: promotedUntil });
    return response.data;
  } catch (error) {
    console.error('Error promoting deal:', error);
    throw error;
  }
};

export const unfeatureDeal = async (dealId) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}/unfeature`);
    return response.data;
  } catch (error) {
    console.error('Error unfeaturing deal:', error);
    throw error;
  }
};

export const updateDeal = async (dealId, updatedData) => {
  try {
    const response = await API.put(`${DEAL_API_URL}/${dealId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};

export const deleteDeal = async (dealId) => {
  try {
    const response = await API.delete(`${DEAL_API_URL}/${dealId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};
