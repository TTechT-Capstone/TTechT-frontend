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
 * Log API errors in a consistent format.
 * @param {string} message - Custom error context
 * @param {Error} error - Error object
 */
const logAPIError = (message, error) => {
  console.error(`${message}:`, error.response?.data || error.message || error);
};

/**
 * Get cart for a user by userId.
 * @param {string} userId
 * @returns {Promise<Object>}
 */
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

/**
 * Creates a new cart for a given user.
 * https://ttecht-backend.onrender.com/api/v1/carts/2
}
 * @param {string} userId
 * @param {string} promotionCode
 * @returns {Promise<Object>}
 */
export const createNewCart = async (userId, promotionCode = '') => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/carts/${userId}`,
      { promotionCode: promotionCode || null },
      { headers: getAuthHeaders() }
    );

    const cart = response.data?.result;
    if (cart?.id) {
      localStorage.setItem('cartId', String(cart.id));
    } else {
      console.error('Cart ID missing in response');
    }

    return cart;
  } catch (error) {
    logAPIError('Error creating cart', error);
    throw new Error('Unable to create cart. Please try again.');
  }
};


/**
 * Add an item to the cart, create the cart if it doesn't exist.
 * @param {string|null} cartId
 * @param {{ productId: number, quantity: number, productName?: string }} newItem
 * @returns {Promise<Object>}
 */
export const addItemToCartAPI = async (cartId, newItem) => {
  try {
    if (!cartId) {
      cartId = localStorage.getItem('cartId');
    }

    if (!cartId) {
      console.log('Cart does not exist. Creating a new cart...');
      const userId = localStorage.getItem('userId');
      const newCart = await createNewCart(userId);
      cartId = newCart.result.id;
      localStorage.setItem('cartId', cartId);
      console.log('New cart created with ID:', cartId);
    }

    const { productId, quantity, productName } = newItem;

    if (!productId) {
      console.error('❌ productId is missing or undefined:', newItem);
      throw new Error('Product ID is required to add an item to the cart.');
    }

    const requestBody = {
      cartId,
      productId,
      quantity,
      productName
    };

    //console.log('✅ Sending request to add item to cart:', requestBody);

    const response = await axios.post(
      `${API_BASE_URL}/cartsItems`,
      requestBody,
      { headers: getAuthHeaders() }
    );

    return response.data;
    console.log('✅ Item added to cart successfully:', response.data);
  } catch (error) {
    console.error('❌ Failed to add item to cart:', error?.response?.data || error.message);
    throw new Error('Unable to add item to the cart. Please try again.');
  }
};


/**
 * Remove item from cart.
 * @param {string} cartId
 * @param {number} itemId
 * @returns {Promise<Object>}
 */
export const removeItemFromCartAPI = async (cartId, itemId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cartsItems/remove/${cartId}`,
      itemId ,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logAPIError('Error removing item from cart', error);
    throw new Error('Unable to remove item from cart. Please try again.');
  }
};

/**
 * Update item quantity in cart.
 * @param {string} cartId
 * @param {string} itemId
 * @param {number} newQuantity
 * @returns {Promise<Object>}
 */
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
    throw new Error('Unable to update item quantity. Please try again.');
  }
};

/**
 * Submit cart for checkout.
 * @param {string} userId
 * @param {string} cartId
 * @returns {Promise<Object>}
 */
export const submitCartAPI = async (userId, cartId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/carts/submit/${userId}/${cartId}`,
      {},
      { headers: getAuthHeaders() }
    );

    localStorage.removeItem('cartId');
    return response.data;
  } catch (error) {
    logAPIError('Error submitting cart', error);
    throw new Error('Unable to submit cart. Please try again.');
  }
};

/**
 * Delete cart.
 * @param {string} userId
 * @param {string} cartId
 * @returns {Promise<Object>}
 */
export const deleteCartAPI = async (userId, cartId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/carts/${userId}/${cartId}`,
      { headers: getAuthHeaders() }
    );
    localStorage.removeItem('cartId');
    return response.data;
  } catch (error) {
    logAPIError('Error deleting cart', error);
    throw new Error('Unable to delete cart. Please try again.');
  }
};
