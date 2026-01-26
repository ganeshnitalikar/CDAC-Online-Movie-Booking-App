import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Booking Service
 * Handles booking-related API calls
 */

/**
 * Initiate a booking
 * POST /user/bookings/initiate
 * @param {number} showId - Show ID
 * @param {Array<number>} seatIds - Array of seat IDs
 * @returns {Promise<Object>} Booking response with bookingId and lockExpiry
 */
export const initiateBooking = async (showId, seatIds) => {
  if (!showId) {
    throw new Error("Show ID is required");
  }
  if (!seatIds || seatIds.length === 0) {
    throw new Error("Please select at least one seat");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login to book tickets");
    }

    const response = await axiosBookingInstance.post("/user/bookings/initiate", {
      showId,
      seatIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating booking:", error);
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      throw new Error("Please login to book tickets");
    }
    if (error.response?.status === 409) {
      throw new Error("Some seats are already locked. Please select different seats.");
    }
    if (error.response?.status === 410) {
      throw new Error("Booking session expired. Please try again.");
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid booking request");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to initiate booking. Please try again.");
  }
};

/**
 * Get ticket details
 * GET /user/bookings/{bookingId}/ticket
 * @param {string|number} bookingId - Booking ID
 * @returns {Promise<Object>} Ticket details
 */
export const getTicket = async (bookingId) => {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login to view ticket");
    }

    const response = await axiosBookingInstance.get(`/user/bookings/${bookingId}/ticket`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    if (error.response?.status === 401) {
      throw new Error("Please login to view ticket");
    }
    if (error.response?.status === 404) {
      throw new Error("Ticket not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch ticket. Please try again.");
  }
};
