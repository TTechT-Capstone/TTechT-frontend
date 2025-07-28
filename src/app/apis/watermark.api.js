import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

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

/*
 * Get all watermarks.
 * @returns {Promise<Object>}
 */
export const getAllWatermarksAPI = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/watermarks`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching watermarks:', error.response?.data || error.message);
    throw new Error('Unable to retrieve watermark details. Please try again.');
  }
};


/*
 * Get watermarks by ID.
 * @param {string} id - The ID of the watermark
 * @returns {Promise<Object>}
 */
export const getWatermarkByIdAPI = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/watermarks/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching watermark by ID:', error.response?.data || error.message);
    throw new Error('Unable to retrieve watermark details. Please try again.');
  }
};

/*
 * Create watermark.
 * @param {Object} watermarkData - The data for the new watermark
 * @returns {Promise<Object>}
 * {
  "store_name": "StoreA",
  "watermark_url_image": "https://domain.com/watermark1.png"
}

 */
export const createWatermarkAPI = async (watermarkData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/watermarks`,
      watermarkData,
      //{ headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error creating watermark:', error.response?.data || error.message);
    throw new Error('Unable to create watermark. Please try again.');
  }
};
