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
 * Get all orders.
 * @param {string|number} orderId
 * @returns {Promise<Object>}
 */
export const getAllOrdersAPI = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/all`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching orders:', error.response?.data || error.message);
    throw new Error('Unable to retrieve order details. Please try again.');
  }
};

/**
 * Create a new order.
 * @param {string|number} userId - The user placing the order
 * @param {string|number} cartId - The cart to convert into an order
 * @param {Object} orderData - Order details (contact info, address, etc.)
 * @returns {Promise<Object>}
 */
export const createOrderAPI = async (userId, cartId, orderData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/${userId}/${cartId}`,
      orderData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error creating order:", error.response?.data || error.message);
    throw new Error("Unable to create order. Please try again.");
  }
};


/**
 * Get orders.
 * @param {string|number} orderId
 * @returns {Promise<Object>}
 */
export const getOrdersAPI = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching orders:', error.response?.data || error.message);
    throw new Error('Unable to retrieve order details. Please try again.');
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

/**
 * Update an order's status.
 * @param {string|number} orderId
 * @param {string} newStatus - e.g., "COMPLETED", "CANCELLED", etc.
 * @returns {Promise<Object>}
 */
export const updateOrderStatusAPI = async (orderId, newStatus) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/orders/${orderId}/status`,
      { orderStatus: newStatus },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error updating order status:', error.response?.data || error.message);
    throw new Error('Unable to update order status. Please try again.');
  }
};

/**
 * Cancel an order.
 * @param {string|number} orderId
 * @returns {Promise<Object>}
 */
export const cancelOrderAPI = async (orderId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/orders/${orderId}/cancel`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error cancelling order:', error.response?.data || error.message);
    throw new Error('Unable to cancel order. Please try again.');
  }
};