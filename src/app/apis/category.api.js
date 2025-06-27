import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api'; 

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
 * 1. Get all categories
 * http://localhost:8082/api/categories
}
 */
export const getAllCategoriesAPI = async (page = 0, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * 2. Get category by ID
 * http://localhost:8082/api/categories/2
 */
export const getCategoryByIdAPI = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * 3. Create Category
 * http://localhost:8082/api/categories
 */
export const createCategoryAPI = async (categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * 4. Update existing category
 * http://localhost:8082/api/categories/2
 */
export const updateCategoryAPI = async (categoryId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, updatedData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * 5. Delete category
 * http://localhost:8082/api/categories/2
 */
export const deleteCategoryAPI = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    throw error;
  }
};
