
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} from "../redux/slices/authSlice";
//import toast from "react-toastify"
import { loginApi, registerApi, verifyAdminOtpApi } from "../config/authApi";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // ================= LOGIN =================
  const login = async (credentials) => {
    try {
      dispatch(loginStart());

      const response = await loginApi(credentials);
      // response = { status, data }
    
      //  ADMIN OTP CASE
      if (response?.data?.requiresOtp) {
        dispatch(loginFailure(null)); // stop loader
        return {
          success: true,
          requiresOtp: true,
        };
      }

      //  NORMAL LOGIN
      if (!response?.data?.token) {
        throw new Error("Invalid login response");
      }
      console.log(response);
      const user = {
        name : response.data.full_name,
        email: credentials.email,
        role: response.data.role,
      };

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("authUser", JSON.stringify(user));

      dispatch(
        loginSuccess({
          user,
          token: response.data.token,
        })
      );

      return {
        success: true,
        role: response.data.role,
      };
    } catch (err) {
      localStorage.clear();

      dispatch(
        loginFailure(
          err.response?.data?.message ||
            err.message ||
       "Invalid email or password"
        )
      );

      return { success: false };
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async ({ email, otp_code }) => {
    try {
      dispatch(loginStart());

      const response = await verifyAdminOtpApi({
        email,
        otp_code,
      });

      if (!response?.data?.token) {
        throw new Error("OTP verification failed");
      }

      const user = {
        email,
        role: response.data.role,
      };

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("authUser", JSON.stringify(user));

      dispatch(
        loginSuccess({
          user,
          token: response.data.token,
        })
      );

      return { status: "success" };
    } catch (err) {
      dispatch(
        loginFailure(
          err.response?.data?.message ||
            err.message ||
            "Invalid or expired OTP"
        )
      );
      return { status: "error" };
    }
  };

  // ================= REGISTER =================
  const register = async (userData) => {
    try {
      dispatch(registerStart());
      const response = await registerApi(userData);
     
      const user = {
        email: userData.email,
        role: response.data.role,
      };

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("authUser", JSON.stringify(user));

      dispatch(
        registerSuccess({
          user,
          token: response.data.token,
        })
      );

      return { success: true };
    } catch (err) {
      dispatch(
        registerFailure(
          err.response?.data?.message || "Registration failed"
        )
      );
      return { success: false };
    }
  };

  const logoutUser = () => {
    localStorage.clear();
    dispatch(logout());
  };

  return {
    login,
    verifyOtp,
    register,
    logout: logoutUser,
    clearError: () => dispatch(clearError()),
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
  };
};
