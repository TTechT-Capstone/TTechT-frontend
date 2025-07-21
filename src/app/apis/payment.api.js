import axios from "axios";

const API_BASE_URL = "https://ttecht-backend.onrender.com/api";

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
 * Create a payment checkout session.
 * @param {Object} payload - Payment information
 * @returns {Promise<Object>}
 * {
    "code": 200,
    "message": "Checkout session created successfully",
    "result": {
        "sessionId": "cs_test_b1KztDzbbfioBJFy7kOb0mnNNQ9RWusPEFOMmowJNylEwtsjKbSX6DOe5f",
        "paymentIntentId": null,
        "clientSecret": null,
        "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_b1KztDzbbfioBJFy7kOb0mnNNQ9RWusPEFOMmowJNylEwtsjKbSX6DOe5f#fidkdWxOYHwnPyd1blpxYHZxWjA0V2JoZzJXNktsUz1KczxMYnNAVHFgT1FxSkhrUTNCUHdXfUZGPFZISEA9UWdAZn0zdEJPTlFxPU9JdVx3R0xMUmRhVzRnckk3REZzUHxdbD0wZmdDd3Q1NTVrUktyZHduQicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl",
        "status": "open",
        "paymentId": 2
    }
}
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
    console.error(
      "❌ Error creating payment checkout:",
      error.response?.data || error.message
    );
    throw new Error("Unable to create payment checkout. Please try again.");
  }
};

/**
 * Get payment status.
 * @param {string|number} paymentId
 * @returns {Promise<Object>}
 * Endpoint: https://ttecht-backend.onrender.com/api/payments/status/{sessionId}
 */
export const getPaymentStatusAPI = async (sessionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payments/status/${sessionId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching payment status by session ID:",
      error.response?.data || error.message
    );
    throw new Error("Unable to retrieve payment status. Please try again.");
  }
};

/**
 * Get payment details by ID.
 * @param {string|number} paymentId
 * @returns {Promise<Object>}
 */
export const getPaymentByIdAPI = async (paymentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching payment by ID:",
      error.response?.data || error.message
    );
    throw new Error("Unable to retrieve payment details. Please try again.");
  }
};

/**
 * Get all payments of the current logged-in user.
 * @returns {Promise<Object>}
 */
export const getMyPaymentsAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/my-payments`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching user payments:",
      error.response?.data || error.message
    );
    throw new Error("Unable to retrieve your payments. Please try again.");
  }
};

/**
 * Create a payment intent.
 * https://ttecht-backend.onrender.com/api/payments/intent
 * @param {Object} payload - Payment intent data
 * @returns {Promise<Object>}
 * {
    "code": 200,
    "message": "Payment intent created successfully",
    "result": {
        "sessionId": null,
        "paymentIntentId": "pi_3RkTuiR3NiV8Ov9I1dwb699C",
        "clientSecret": "pi_3RkTuiR3NiV8Ov9I1dwb699C_secret_WmaR0fg3fPZ1LGhIlmeSWaS5D",
        "checkoutUrl": null,
        "status": "requires_payment_method",
        "paymentId": 1
    }
}
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
    console.error(
      "❌ Error creating payment intent:",
      error.response?.data || error.message
    );
    throw new Error("Unable to create payment intent. Please try again.");
  }
};
