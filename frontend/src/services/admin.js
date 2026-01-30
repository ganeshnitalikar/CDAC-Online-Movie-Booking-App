import AxiosInstance from "../config/axiosInstance";
import { API_CONFIG } from "../config/api";

export const getUserProfile = async () => {
  const response = await AxiosInstance.get(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const createOwner = async (ownerData) => {
  try {
    const response = await AxiosInstance.post(
      API_CONFIG.ENDPOINTS.ADMIN.ADD_THEATER_OWNER,
      {
        full_name: ownerData.name,
        email: ownerData.email,
        password: ownerData.password,
        phone_number: ownerData.phone,
        city: ownerData.city,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return {
      success: true,
      data: response.data,
      message: response.data?.message || "Theatre owner created successfully",
    };
  } catch (error) {
    console.error("Create Owner API Error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create theatre owner",
    };
  }
};
