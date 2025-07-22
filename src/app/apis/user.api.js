import axios from 'axios';

const API_BASE_URL = 'https://ttecht-backend.onrender.com/api/v1';

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

/* Get user by ID
    * @param {string|number} userId - The ID of the user to retrieve
    * @returns {Promise<Object>} - User data
    */
export const getUserByIdAPI = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/${userId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user by ID:', error.response?.data || error.message);
    throw new Error('Unable to retrieve user details. Please try again.');
  }
};

/** * Get all users.
 * @returns {Promise<Object[]>} - List of users
 * */
export const getAllUsersAPI = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/users/`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    }
    catch (error) {
        console.error('❌ Error fetching users:', error.response?.data || error.message);
        throw new Error('Unable to retrieve user list. Please try again.');
    }
};
