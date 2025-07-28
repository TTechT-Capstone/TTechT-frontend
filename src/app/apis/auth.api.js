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
 * Log in a user.
 * @param {Object} credentials - The login credentials.
 * @returns {Promise<Object>} - API response data.
 */
export const loginAsUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/token`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Register a new user.
 * @param {Object} userInfo - User registration information.
 * @returns {Promise<Object>} - API response data.
 */
export const registerUser = async (userInfo) => {
  try {
    //console.log("Registering user with info:", userInfo);
    const response = await axios.post(`${API_BASE_URL}/users`, userInfo);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Create roles.
 * @returns {Promise<Object>} - API response data.
 */
export const createRoles = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/roles`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create roles:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get all roles.
 * @returns {Promise<Object[]>} - API response data.
 */
export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles/all`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get the profile of the current user.
 * @returns {Promise<Object>} - API response data.
 */
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/my-info`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get profile:", error);
    throw error.response?.data || error;
  }
};

/**
 * Update information of a user by ID.
 * @param {string|number} userId
 * @param {Object} userInfo
 */
export const updateUser = async (userId, userInfo) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      userInfo,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update profile for user ${userId}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Refresh authentication token.
 */
export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error.response?.data || error;
  }
};

/**
 * Forgot password (send reset email).
 * @param {Object} payload - e.g. { email: 'user@example.com' }
 */
export const forgotPassword = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/forgot-password`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to initiate forgot password:", error);
    throw error.response?.data || error;
  }
};

/**
 * Redis connectivity check (test API).
 */
export const redisCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/test/redis`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to check Redis:", error);
    throw error.response?.data || error;
  }
};
/**
 * Validate reset token.
 * @param {string} token
 */
export const validateToken = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/validate-reset-token?token=${token}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to validate reset token:", error);
    throw error.response?.data || error;
  }
};

/**
 * Change password for logged-in user.
 * @param {string|number} userId
 * @param {Object} payload - {
 *   oldPassword: string,
 *   newPassword: string,
 *   confirmNewPassword: string
 * }
 */
export const updatePassword = async (userId, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/update-password/${userId}`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update password:", error);
    throw error.response?.data || error;
  }
};

/**
 * Reset password using token.
 * @param {Object} payload - e.g. { token, newPassword }
 * {
    "token" : "XAXJp089Ki25LOzk4rYvxC78P2GaII-EKDRlKZ3hhOs",
    "newPassword" : "securePass123",
    "confirmNewPassword" : "securePass123"
}
 */
export const resetPassword = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/reset-password`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to reset password:", error);
    throw new Error(
      error.response?.data?.message ||
        "Unable to reset password. Please try again."
    );
  }
};
