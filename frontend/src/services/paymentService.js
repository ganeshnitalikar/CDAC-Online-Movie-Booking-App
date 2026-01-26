import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Payment Service
 * Handles payment-related API calls
 * Base URL: http://localhost:8080
 */

/**
 * Create payment order
 * POST /user/payments/order
 * @param {string|number} bookingId - Booking ID
 * @returns {Promise<Object>} Payment order data with Razorpay order details
 */
export const createPaymentOrder = async (bookingId) => {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login to proceed with payment");
    }

    const response = await axiosBookingInstance.post("/user/payments/order", {
      bookingId: Number(bookingId),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment order:", error);
    if (error.response?.status === 401) {
      throw new Error("Please login to proceed with payment");
    }
    if (error.response?.status === 404) {
      throw new Error("Booking not found");
    }
    if (error.response?.status === 410) {
      throw new Error("Booking session expired. Please try again.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create payment order. Please try again.");
  }
};
