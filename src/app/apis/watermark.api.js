import axios from 'axios';

const API_BASE_URL = 'https://ttecht-watermark-service.onrender.com';

/**
 * Get Authorization headers with Bearer token.
 * Throws an error if token is missing in localStorage.
 * @returns {Object} - HTTP headers with Authorization token
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
 * Upload watermark images.
 * Endpoint: POST /api/images/upload
 * Example: https://ttecht-watermark-service.onrender.com/api/images/upload
 */

/**
 * Get watermark image info by unique ID.
 * Endpoint: GET /api/images/watermark_app/:id/info
 * Example: https://ttecht-watermark-service.onrender.com/api/images/watermark_app/ujn5pxt0sfjo7d5tkdsg/info
 */

/**
 * Get all watermarks.
 * Endpoint: GET /watermarks
 * @returns {Promise<Object>} - List of all watermarks
 */
export const getAllWatermarksAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/watermarks`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching watermarks:', error.response?.data || error.message);
    throw new Error('Unable to retrieve watermark details. Please try again.');
  }
};

/**
 * Get watermark by ID.
 * Endpoint: GET /watermarks/:id
 * @param {string|number} id - Watermark ID
 * @returns {Promise<Object>} - Watermark details
 */
export const getWatermarkByIdAPI = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/watermarks/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching watermark by ID:', error.response?.data || error.message);
    throw new Error('Unable to retrieve watermark details. Please try again.');
  }
};

/**
 * Create a new watermark.
 * Endpoint: POST /watermarks
 * @param {Object} watermarkData - New watermark data
 * @param {string} watermarkData.store_name - Store name
 * @param {string} watermarkData.watermark_url_image - URL of watermark image
 * @returns {Promise<Object>} - Created watermark object
 *
 * Example payload:
 * {
 *   "store_name": "StoreA",
 *   "watermark_url_image": "https://domain.com/watermark1.png"
 * }
 */
export const createWatermarkAPI = async (watermarkData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/watermarks`, watermarkData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error creating watermark:', error.response?.data || error.message);
    throw new Error('Unable to create watermark. Please try again.');
  }
};

/**
 * Embed a watermark into an image.
 * Endpoint: POST /api/images/embed-watermark
 * @param {Object} payload - Request body
 * @param {string} payload.original_image - Base64-encoded original image
 * @param {string} payload.watermark_image - Base64-encoded watermark image
 * @param {number} [payload.alpha=0.6] - Transparency factor (default: 0.6)
 * @returns {Promise<Object>} - Response with watermarked image and metadata
 */
export const embedWatermarkAPI = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/images/embed-watermark`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error embedding watermark:', error.response?.data || error.message);
    throw new Error('Unable to embed watermark. Please try again.');
  }
};

/**
 * Extract watermark from a suspect image.
 * Endpoint: POST /api/images/extract-watermark
 * @param {Object} payload - Request body
 * @param {string} payload.suspect_image - Base64-encoded suspect image
 * @param {string} [payload.sideinfo_json_path] - Optional path to .wm.json side info
 * @returns {Promise<Object>} - Extraction result with watermark or instructions to re-embed
 */
export const extractWatermarkAPI = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/images/extract-watermark`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error extracting watermark:', error.response?.data || error.message);
    throw new Error('Unable to extract watermark. Please try again.');
  }
};

/**
 * Detect whether an extracted watermark matches the original.
 * Endpoint: POST /api/images/detect-watermark
 * @param {Object} payload - Request body
 * @param {string} payload.original_watermark - Base64-encoded original watermark
 * @param {string} payload.extracted_watermark - Base64-encoded extracted watermark
 * @param {number} [payload.pcc_threshold=0.7] - Threshold for correlation (default: 0.7)
 * @param {boolean} [payload.save_record=false] - Save detection record (optional, admin use)
 * @param {string} [payload.suspect_image] - Base64-encoded suspect image (optional)
 * @returns {Promise<Object>} - Detection result with metrics (PCC, MSE, SSIM, PSNR)
 */
export const detectWatermarkAPI = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/images/detect-watermark`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error detecting watermark:', error.response?.data || error.message);
    throw new Error('Unable to detect watermark. Please try again.');
  }
};
