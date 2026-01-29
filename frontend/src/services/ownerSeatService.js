import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Owner Seat Service
 * POST /booking/owner/seats
 */

export const createSeats = async (screenId, seats) => {
  if (!screenId) {
    throw new Error("screenId is required");
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    throw new Error("seats must be a non-empty array");
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required. Please login.");
  }

  try {
    const response = await axiosBookingInstance.post(
      "/booking/owner/seats",
      {
        screenId,
        seats,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating seats:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to create seats. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create seats. Please try again.");
  }
};

