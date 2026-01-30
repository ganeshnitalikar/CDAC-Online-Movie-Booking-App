import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Show Service
 * Handles show-related API calls
 * Base URL: http://localhost:8080
 */

/**
 * Get shows by city
 * GET /shows?city={city}
 *  city - City name
 *  return List of shows
 */
export const getShowsByCity = async (city) => {
  if (!city) {
    throw new Error("City is required");
  }

  try {
    const response = await axiosBookingInstance.get("/shows", {
      params: { city },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching shows:", error);
    if (error.response?.status === 404) {
      throw new Error("No shows found for this city");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch shows. Please try again.");
  }
};

/**
 * Get shows for a specific screen
 * GET /screens/{screenId}/shows
 *  screenId - Screen ID
 *  return Array of show objects
 */
export const getShowsByScreen = async (screenId) => {
  if (!screenId) {
    throw new Error("Screen ID is required");
  }

  try {
    const response = await axiosBookingInstance.get(`/screens/${screenId}/shows`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching shows:", error);
    if (error.response?.status === 404) {
      throw new Error("No shows found for this screen");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch shows. Please try again.");
  }
};

export const getShowById = async (showId) => {
  if (!showId) {
    throw new Error("Show ID is required");
  }

  try {
    const response = await axiosBookingInstance.get(`/shows/${showId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching show details:", error);
    if (error.response?.status === 404) {
      throw new Error("Show not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch show details. Please try again.");
  }
};

/**
 * Get seats for a specific show
 * GET /shows/{showId}/seats
 *  showId - Show ID
 *  return Array of seat objects
 */
export const getSeatsByShow = async (showId) => {
  if (!showId) {
    throw new Error("Show ID is required");
  }

  try {
    const response = await axiosBookingInstance.get(`/shows/${showId}/seats`);
    console.log("response", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching seats:", error);
    if (error.response?.status === 404) {
      throw new Error("Seats not found for this show");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch seats. Please try again.");
  }
};
