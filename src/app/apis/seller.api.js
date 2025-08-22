import axios from "axios";

const API_BASE_URL = "https://ttecht-backend.onrender.com/api/v1";

/**
 * Helper function to get the auth headers.
 * @returns {Object} - Authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("idToken");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Create a new seller.
 * @param {Object} sellerInfo - The seller registration information.
 * @returns {Promise<Object>} - API response data.
 */
export const createSeller = async (sellerInfo) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sellers`,
      sellerInfo,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create seller:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get seller information by seller ID.
 * @param {string|number} sellerId - Seller ID.
 * @returns {Promise<Object>} - Seller data.
 */
export const getSellerByUserId = async (sellerId) => {
  try {
  const response = await axios.get(`${API_BASE_URL}/sellers/user/${sellerId}`, {
      headers: getAuthHeaders(),
    });
    return response.data.result;
    console.log("Seller data:", response.data.result);
  } catch (error) {
    console.error(`Failed to get seller by user ID ${sellerId}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Update seller information by seller ID.
 * @param {string|number} sellerId - Seller ID.
 * @param {Object} updatedInfo - Updated seller info.
 * @returns {Promise<Object>} - Updated seller data.
 */
export const updateSellerById = async (sellerId, updatedInfo) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/sellers/${sellerId}`,
      updatedInfo,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update seller by ID ${sellerId}:`, error);
    throw error.response?.data || error;
  }
};

//Get-Seller-Order
//{{baseURL}}/api/v1/orders/sellers?sellerId=54
export const getSellerOrders = async (sellerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/sellers`, {
      params: { sellerId },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch orders for seller ${sellerId}:`, error);
    throw error.response?.data || error;
  }
};