

export const API_CONFIG = {

  BASE_URL: import.meta.env.REACT_APP_API_URL || 'http://localhost:4000',
  MOVIE_BASE_URL: import.meta.env.REACT_APP_MOVIE_API_URL || 'http://localhost:8080',

   
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/user/login',
      REGISTER: '/user/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      VERIFY_ADMIN_OTP:'/user/verify-admin-otp',
      FORGOT_PASSWORD:'/auth/forgot-password',
      RESET_PASSWORD:'/auth/reset-password',
      LOGOUT:'user/logout',
      GET_PROFILE:"/user/profile",
      UPDATE_PROFILE:"/user/update-profile",
      DELETE_PROFILE:"/user/delete-account"

    },
     ADMIN: {
      ADD_THEATER_OWNER: '/admin/add-theater-owner',
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