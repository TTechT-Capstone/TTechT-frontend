import axios from "axios";
import { refreshToken } from "@/app/apis/auth.api";

// Create an axios instance
const api = axios.create();

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 and not a retry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const data = await refreshToken();
        const newToken = data.result?.accessToken || data.accessToken;
        if (newToken) {
          localStorage.setItem("idToken", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Optionally: logout user or redirect to login
        localStorage.removeItem("idToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
