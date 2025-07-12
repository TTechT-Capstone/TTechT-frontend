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
 * Create a payment checkout session.
 * @param {Object} payload - Payment information
 * @returns {Promise<Object>}
 */
export const createPaymentCheckoutAPI = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/checkout`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error creating payment checkout:', error.response?.data || error.message);
    throw new Error('Unable to create payment checkout. Please try again.');
  }
};

/**
 * Get payment details by ID.
 * @param {string|number} paymentId
 * @returns {Promise<Object>}
 */
export const getPaymentByIdAPI = async (paymentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payments/${paymentId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching payment by ID:', error.response?.data || error.message);
    throw new Error('Unable to retrieve payment details. Please try again.');
  }
};

/**
 * Get all payments of the current logged-in user.
 * @returns {Promise<Object>}
 */
export const getMyPaymentsAPI = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payments/my-payments`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user payments:', error.response?.data || error.message);
    throw new Error('Unable to retrieve your payments. Please try again.');
  }
};

/**
 * Create a payment intent.
 * @param {Object} payload - Payment intent data
 * @returns {Promise<Object>}
 */
export const createPaymentIntentAPI = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/intent`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error creating payment intent:', error.response?.data || error.message);
    throw new Error('Unable to create payment intent. Please try again.');
  }
};
