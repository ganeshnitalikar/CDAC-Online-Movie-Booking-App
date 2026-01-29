import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Create Razorpay order
 * POST /booking/user/payments/order
 */
export const createRazorpayOrder = async (bookingId) => {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Please login to continue");
  }

  try {
    const response = await axiosBookingInstance.post(
      "/booking/user/payments/order",
      { bookingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);

    if (error.response?.status === 410) {
      throw new Error("Booking expired. Please select seats again.");
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to initiate payment");
  }
};
