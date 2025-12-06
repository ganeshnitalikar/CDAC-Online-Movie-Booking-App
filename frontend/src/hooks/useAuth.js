import { useDispatch, useSelector } from "react-redux"
import { clearError, loginFailure, loginStart, loginSuccess, logout } from "../redux/slices/authSlice";


export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const loading = useSelector((state) =>
        state.auth.loading
    )
    const error = useSelector((state) => state.auth.error)

    const login = async (credentials) => {
        try {
            dispatch(loginStart());
            const mockUser = {
                id: 1,
                email: credentials.email,
                name: "MOCK USER",
                role: "user"
            }
            dispatch(loginSuccess(mockUser));
        } catch (error) {
            dispatch(loginFailure(error.message));
        }
    }

    const logoutUser = () => {
        dispatch(logout());
    }
    const clearAuthError = () => {
        dispatch(clearError());
    }
    return {
        user, 
        isAuthenticated,
        loading, 
        error,
        login,
        logout: logoutUser,
        clearError : clearAuthError
    }
};
