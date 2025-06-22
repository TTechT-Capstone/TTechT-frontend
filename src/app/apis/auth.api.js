// src/apis/auth.api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/v1';

/**
 * Helper function to get the auth headers.
 * @returns {Object} - Authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('idToken');
  if (!token) {
    throw new Error('Authorization token is missing');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Log in a user.
 * @param {Object} credentials - The login credentials.
 * @returns {Promise<Object>} - API response data.
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Log in an admin user.
 * @param {Object} credentials - The admin login credentials.
 * @returns {Promise<Object>} - API response data.
 */
export const loginAsAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login/admin`, credentials);
    return response.data;
  } catch (error) {
    console.error('Admin login failed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Register a new user.
 * @param {Object} userInfo - User registration information.
 * @returns {Promise<Object>} - API response data.
 */
export const register = async (userInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userInfo);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Create roles.
 * @returns {Promise<Object>} - API response data.
 */
export const createRoles = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/roles`, {}, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to create roles:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get all roles.
 * @returns {Promise<Object[]>} - API response data.
 */
export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles/all`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get the profile of the current user.
 * @returns {Promise<Object>} - API response data.
 */
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/my-info`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to get profile:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update the profile of a user by ID.
 * @param {string|number} userId - ID of the user.
 * @param {Object} userInfo - Updated user data.
 * @returns {Promise<Object>} - API response data.
 */
export const updateProfile = async (userId, userInfo) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userInfo, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error(`Failed to update profile for user ${userId}:`, error);
    throw error.response?.data || error;
  }
};
