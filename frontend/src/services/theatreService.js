import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Theatre Service
 * Handles theatre-related API calls
 * Base URL: http://localhost:8080
 */

/**
 * Get theatres showing a specific movie
 * GET /theatres?movieId={movieId}
 * @param {string|number} movieId - Movie ID
 * @returns {Promise<Array>} Array of theatre objects
 */
export const getTheatresByMovie = async (movieId) => {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  try {
    const response = await axiosBookingInstance.get("/theatres", {
      params: { movieId },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching theatres:", error);
    if (error.response?.status === 404) {
      throw new Error("No theatres found for this movie");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch theatres. Please try again.");
  }
};

/**
 * Get all theatres (admin)
 * GET /admin/theatres
 * @returns {Promise<Array>} Array of theatre objects
 */
export const getAllTheatres = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axiosBookingInstance.get("/admin/theatres");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching theatres:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view theatres");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch theatres. Please try again.");
  }
};
