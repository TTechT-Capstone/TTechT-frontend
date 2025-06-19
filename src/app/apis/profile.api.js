import axios from 'axios';

const API_BASE_URL = '';

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
 * Get profile details.
 * @returns {Promise<Object>} - API response data containing profile details.
 */
export const getProfileDetailAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() });
        //console.log('Profile data fetched:', response.data); // Log the response
        return response.data; 
    } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;  // Rethrow the error to be handled by the calling function
    }
};

/**
 * Update profile details.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<Object>} - API response data after updating the profile.
 */
export const updateProfileAPI = async (profileData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/profile`, profileData, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(), // Ensure this function returns the correct headers
            },
        });

        // Validate the response structure
        if (response.data) {
            return response.data; // Return the updated profile data
        } else {
            console.error('Error: Unexpected response format');
            throw new Error('Profile update failed: Invalid response format.');
        }
    } catch (error) {
        // Enhanced error handling
        console.error('Error updating profile:', error.response ? error.response.data : error.message);
        throw new Error('Unable to update profile. Please try again.');
    }
};