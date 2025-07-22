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
 * 1. Get all products with pagination
 * http://localhost:8082/api/products
}
 */
export const getAllProductsAPI = async (page = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * 2. Get product by ID
 * http://localhost:8082/api/products/2
 */
export const getProductByIdAPI = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    console.log("Product data:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

/**
 * 3. Create Product
 * http://localhost:8082/api/products
 */
export const createProductAPI = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * 4. Update existing product
 * http://localhost:8082/api/products/2
 */
export const updateProductAPI = async (productId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/products/${productId}`,
      updatedData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

/**
 * 5. Delete product
 * http://localhost:8082/api/products/2
 */
export const deleteProductAPI = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/products/${productId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};

/**
 * 6. Get products by category
 * http://localhost:8082/api/products/category/3
 */
export const getProductsByCategoryAPI = async (category) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/category/${category}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by category ${category}:`, error);
    throw error;
  }
};

/**
 * 7. Search products by name
 * http://localhost:8082/api/products/search
 */
export const searchProductsByNameAPI = async (name, page = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/search?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error searching products with name "${name}":`, error);
    throw error;
  }
};

/**
 * 8. Get products by price range
 * http://localhost:8082/api/products/price
 */
export const getProductsByPriceRangeAPI = async (min, max) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/price?min=${min}&max=${max}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching products by price range ${min}-${max}:`,
      error
    );
    throw error;
  }
};

/**
 * 9. Get products by store name
 * http://localhost:8082/api/products/store
 */
export const getProductsByStoreNameAPI = async (storeName) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/store/${storeName}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by store "${storeName}":`, error);
    throw error;
  }
};

/**
 * 10. Update product stock quantity (PATCH)
 * http://localhost:8082/api/products/store/Tien
 */
export const updateProductStockAPI = async (productId, stock) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}/stock`,
      {
        stock: stock,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating stock for product ${productId}:`, error);
    throw error;
  }
};

/**
 * 11. Get best selling products
 * http://localhost:8082/api/products/best-sellers?limit=10
 */
export const getBestSellingProductsAPI = async (limit = 4) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/best-sellers?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    throw error;
  }
};

/**
 * 12. Get best sellers by category
 * http://localhost:8082/api/products/best-sellers/category/1?limit=10
 */

export const getBestSellersByCategoryAPI = async (categoryId, limit = 4) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/best-sellers/category/${categoryId}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching best sellers for category ${categoryId}:`,
      error
    );
    throw error;
  }
};

/**
 * 13. Get best new arrival products
 * https://ttecht-backend.onrender.com/api/products/new-arrivals?limit=5
 */

export const getBestNewArrivalsAPI = async (limit = 4) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/new-arrivals?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching best new arrivals:", error);
    throw error;
  }
}