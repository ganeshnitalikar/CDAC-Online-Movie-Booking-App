import { createSlice } from "@reduxjs/toolkit"

const getStoredToken = () => {
    try {
        return localStorage.getItem('authToken');
    } catch (error) {
        return null;
    }
};

const getStoredUser = () => {
    try {
        const user = localStorage.getItem('authUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

const initialState = {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login actions
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;

            // Store in localStorage
            localStorage.setItem('authToken', action.payload.token);
            localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;

            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        },

        // Register actions
        registerStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;

            // Store in localStorage
            localStorage.setItem('authToken', action.payload.token);
            localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;
        },

        // Logout action
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;

            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        },

        // Token refresh action
        refreshToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('authToken', action.payload);
        },

        // Clear error action
        clearError: (state) => {
            state.error = null;
        },

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
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    logout,
    refreshToken,
    clearError,
    initializeAuth
} = authSlice.actions;
export default  authSlice.reducer;