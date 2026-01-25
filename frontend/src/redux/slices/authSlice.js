

import { createSlice } from "@reduxjs/toolkit";

/* ---------- Helpers ---------- */
const getStoredToken = () => {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/* ---------- Initial State ---------- */
const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  loading: false,
  error: null,
};

/* ---------- Slice ---------- */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login start
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Login success
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      // Persist in localStorage
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("authUser", JSON.stringify(action.payload.user));
    },

    // Login failure
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;

      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },

    // Register start
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Register success
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("authUser", JSON.stringify(action.payload.user));
    },

    // Register failure
    registerFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;

      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Re-initialize auth from localStorage (optional)
    initializeAuth: (state) => {
      const token = getStoredToken();
      const user = getStoredUser();
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
});

/* ---------- Exports ---------- */
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
