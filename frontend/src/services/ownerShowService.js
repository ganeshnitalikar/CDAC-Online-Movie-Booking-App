import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Owner Show Service
 * Handles show management API calls for OWNER role
 * Base URL: http://localhost:8080
 */

/**
 * Get all shows for the current owner
 * GET /owner/shows
 * @param {Object} filters - Optional filters
 * @param {string|number} filters.screenId - Filter by screen ID
 * @param {string|number} filters.movieId - Filter by movie ID
 * @returns {Promise<Array>} Array of show objects
 */
export const getOwnerShows = async (filters = {}) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.get("/owner/shows", {
      params: filters,
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching owner shows:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view shows. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch shows. Please try again.");
  }
};

/**
 * Get a specific show by ID
 * GET /owner/shows/{showId}
 * @param {string|number} showId - Show ID
 * @returns {Promise<Object>} Show object
 */
export const getOwnerShowById = async (showId) => {
  if (!showId) {
    throw new Error("Show ID is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.get(`/owner/shows/${showId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching show details:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view this show.");
    }
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
 * Create a new show
 * POST /owner/shows
 * @param {Object} payload - Show data
 * @param {string|number} payload.movieId - Movie ID
 * @param {string|number} payload.screenId - Screen ID
 * @param {string} payload.showTime - Show time (ISO datetime string)
 * @param {number} payload.price - Ticket price
 * @returns {Promise<Object>} Created show object
 */
export const createShow = async (payload) => {
  if (!payload) {
    throw new Error("Show data is required");
  }

  if (!payload.movieId || !payload.screenId || !payload.showTime || !payload.price) {
    throw new Error("Movie ID, Screen ID, Show Time, and Price are required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.post("/owner/shows", {
      movieId: Number(payload.movieId),
      screenId: Number(payload.screenId),
      showTime: payload.showTime, // ISO datetime string
      price: Number(payload.price),
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating show:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to create shows. Owner role required.");
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid show data");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create show. Please try again.");
  }
};

/**
 * Update an existing show
 * PUT /owner/shows/{showId}
 * @param {string|number} showId - Show ID to update
 * @param {Object} payload - Updated show data (partial update supported)
 * @returns {Promise<Object>} Updated show object
 */
export const updateShow = async (showId, payload) => {
  if (!showId) {
    throw new Error("Show ID is required");
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("Update data is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const showIdStr = String(showId);
    const updatePayload = {};
    
    if (payload.movieId !== undefined) {
      updatePayload.movieId = Number(payload.movieId);
    }
    if (payload.screenId !== undefined) {
      updatePayload.screenId = Number(payload.screenId);
    }
    if (payload.showTime !== undefined) {
      updatePayload.showTime = payload.showTime;
    }
    if (payload.price !== undefined) {
      updatePayload.price = Number(payload.price);
    }

    const response = await axiosBookingInstance.put(
      `/owner/shows/${showIdStr}`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating show:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to update this show. Owner role required.");
    }
    if (error.response?.status === 404) {
      throw new Error("Show not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update show. Please try again.");
  }
};

/**
 * Delete a show
 * DELETE /owner/shows/{showId}
 * @param {string|number} showId - Show ID to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteShow = async (showId) => {
  if (!showId) {
    throw new Error("Show ID is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.delete(`/owner/shows/${showId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || { success: true, message: "Show deleted successfully" };
  } catch (error) {
    console.error("Error deleting show:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to delete this show. Owner role required.");
    }
    if (error.response?.status === 404) {
      throw new Error("Show not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete show. Please try again.");
  }
};
