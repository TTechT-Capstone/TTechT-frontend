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

/**
 * Create a new order.
 * @param {string|number} userId - The user placing the order
 * @param {string|number} cartId - The cart to convert into an order
 * @returns {Promise<Object>}
 */
export const createOrderAPI = async (userId, cartId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/${userId}/${cartId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error creating order:', error.response?.data || error.message);
    throw new Error('Unable to create order. Please try again.');
  }
};

/**
 * Get all orders for a user.
 * @param {string|number} userId
 * @returns {Promise<Object>}
 */
export const getOrdersByUserIdAPI = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/user/${userId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching orders by user ID:', error.response?.data || error.message);
    throw new Error('Unable to retrieve orders. Please try again.');
  }
};

/**
 * Get an order by its ID.
 * @param {string|number} orderId
 * @returns {Promise<Object>}
 */
export const getOrderByIdAPI = async (orderId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/${orderId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching order by ID:', error.response?.data || error.message);
    throw new Error('Unable to retrieve order details. Please try again.');
  }
};
