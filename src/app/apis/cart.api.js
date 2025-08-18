import axios from 'axios';

const API_BASE_URL = 'https://ttecht-backend.onrender.com/api/v1';

// Get authorization token
const getAuthHeaders = () => {
  const token = localStorage.getItem('idToken');
  if (!token) throw new Error('Authorization token is missing');
  return { Authorization: `Bearer ${token}` };
};

// Log errors uniformly
const logAPIError = (message, error) => {
  console.error(`${message}:`, error.response?.data || error.message || error);
};

// 📦 Get cart
export const getCartAPI = async (userId) => {
  try {
    if (!userId) throw new Error('Missing user ID');
    const response = await axios.get(`${API_BASE_URL}/carts/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data?.result;
  } catch (error) {
    logAPIError('Error fetching cart data', error);
    throw error;
  }
};

// 🛒 Create cart
export const createNewCart = async (userId, promotionCode = '') => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/carts/${userId}`,
      { promotionCode: promotionCode || null },
      { headers: getAuthHeaders() }
    );
    return response.data?.result;
  } catch (error) {
    logAPIError('Error creating cart', error);
    throw new Error('Unable to create cart. Please try again.');
  }
};

// ➕ Add item to cart
export const addItemToCartAPI = async (cartId, newItem) => {
  try {
    const { productId, quantity, productName, color, size } = newItem;
    if (!cartId || !productId) {
      throw new Error('Cart ID and product ID are required');
    }

    const response = await axios.post(
      `${API_BASE_URL}/cartsItems`,
      {
        cartId,
        productId,
        quantity,
        productName,
        color,
        size,   
      },
      { headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    logAPIError('Failed to add item to cart', error);
    throw error;
  }
};

// ❌ Remove item
export const removeItemFromCartAPI = async (cartId, itemId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cartsItems/remove/${cartId}/${itemId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logAPIError('Error removing item from cart', error);
    throw error;
  }
};

// 🔁 Update quantity
export const updateItemQuantityAPI = async (cartId, itemId, newQuantity) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/cartsItems/quantity/${cartId}/${itemId}?newQuantity=${newQuantity}`,
      null,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logAPIError('Error updating item quantity', error);
    throw error;
  }
};

// ✅ Submit cart
export const submitCartAPI = async (userId, cartId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/carts/submit/${userId}/${cartId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logAPIError('Error submitting cart', error);
    throw error;
  }
};

// 🗑️ Delete cart
export const deleteCartAPI = async (userId, cartId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/carts/${userId}/${cartId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logAPIError('Error deleting cart', error);
    throw error;
  }
};
