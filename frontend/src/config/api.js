

export const API_CONFIG = {
  BASE_URL: import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
    },
    MOVIES: {
      LIST: '/movies',
      DETAILS: '/movies/:id',
      SEARCH: '/movies/search',
    },
    BOOKINGS: {
      LIST: '/bookings',
      CREATE: '/bookings',
      CANCEL: '/bookings/:id/cancel',
    },
    THEATERS: {
      LIST: '/theaters',
      DETAILS: '/theaters/:id',
    },
  },
  
  TIMEOUT: 10000,
  
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

export const getAuthHeaders = (token) => ({
  ...API_CONFIG.DEFAULT_HEADERS,
  'Authorization': `Bearer ${token}`,
});

export default API_CONFIG;