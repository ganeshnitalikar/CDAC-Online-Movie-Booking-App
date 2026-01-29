import axios from "axios";

// Axios instance for Booking Service APIs (localhost:8080)
const axiosBookingInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_BOOKING_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically (using "token" key as per requirements)
axiosBookingInstance.interceptors.request.use(
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
axiosBookingInstance.interceptors.response.use(
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

export default axiosBookingInstance;
