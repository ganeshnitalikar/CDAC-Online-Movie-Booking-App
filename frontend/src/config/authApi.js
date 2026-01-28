

import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./api";

export const loginApi = async (credentials) => {
  const res = await axiosInstance.post(
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return res.data;
};

export const registerApi = async (userData) => {
  const res = await axiosInstance.post(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    userData
  );
  return res.data;
};

export const verifyAdminOtpApi = async (data) => {
  const res = await axiosInstance.post(
    API_CONFIG.ENDPOINTS.AUTH.VERIFY_ADMIN_OTP,
    data
  );
  return res.data;
};

export const forgotPassword = async (data) => {
  try {
    const res = await axiosInstance.post( 
    API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD
      , 
      data
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to send OTP. Please try again.");
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await axiosInstance.post(
     API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to reset password. Please try again.");
  }
};



