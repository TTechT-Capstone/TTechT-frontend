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

//Payment Checkout: https://ttecht-backend.onrender.com/api/payments/checkout


//Get Payment By Id: https://ttecht-backend.onrender.com/api/payments/4


//Get my payments: https://ttecht-backend.onrender.com/api/payments/my-payments


//Payment Intent: https://ttecht-backend.onrender.com/api/payments/intent