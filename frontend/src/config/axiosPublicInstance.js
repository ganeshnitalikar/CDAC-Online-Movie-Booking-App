import axios from "axios";
import API_CONFIG from "./api";

// Axios instance for public APIs (no authentication)
const axiosPublicInstance = axios.create({
  baseURL: API_CONFIG.MOVIE_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Handle global errors
axiosPublicInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // No auth handling for public instance
    return Promise.reject(error);
  }
);

export default axiosPublicInstance;
