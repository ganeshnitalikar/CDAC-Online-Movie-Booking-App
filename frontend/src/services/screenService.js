import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Screen Service
 * Handles screen-related API calls
 * Base URL: http://localhost:8080
 */

/**
 * Get screens for a specific theatre
 * GET /theatres/{theatreId}/screens
 *  theatreId - Theatre ID
 *  return Array of screen objects
 */
export const getScreensByTheatre = async (theatreId) => {
  if (!theatreId) {
    throw new Error("Theatre ID is required");
  }

  try {
    const response = await axiosBookingInstance.get(`/theatres/${theatreId}/screens`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching screens:", error);
    if (error.response?.status === 404) {
      throw new Error("No screens found for this theatre");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch screens. Please try again.");
  }
};
