import axios from "axios";
import { refreshToken } from "@/app/apis/auth.api";

const api = axios.create();

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we've already tried to refresh this token, don't try again
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      // Set the retry flag for the original request
      originalRequest._retry = true;

      // If a refresh is already in progress, queue the request and wait
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      // This is the first 401, so we'll handle the refresh
      isRefreshing = true;

      try {
        const data = await refreshToken();
        const newToken = data.result?.accessToken || data.accessToken;
        
        if (newToken) {
          localStorage.setItem("idToken", newToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // If the refresh token request succeeds but returns no new token, we should log out.
          throw new Error("Refresh token did not return a new access token.");
        }
      } catch (refreshError) {
        localStorage.removeItem("idToken");
        window.location.href = "/auth/login";
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;