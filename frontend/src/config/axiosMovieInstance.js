import axios from "axios";
import API_CONFIG from "./api";

// Axios instance for Movie Service APIs (localhost:8080)
// Used for authenticated movie API calls (owner/admin)
const axiosMovieInstance = axios.create({
  baseURL: API_CONFIG.MOVIE_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Attach token automatically for movie service
axiosMovieInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors
axiosMovieInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("authUser");
    }
    return Promise.reject(error);
  }
);

export default axiosMovieInstance;
