import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'


export const store = configureStore({
    reducer: {
        auth: authSlice,
    }
})

export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
