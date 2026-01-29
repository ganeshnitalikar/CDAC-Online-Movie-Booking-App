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

    const response = await axiosBookingInstance.get("/booking/owner/shows", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters,
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

    const response = await axiosBookingInstance.get(`/booking/owner/shows/${showId}` ,{
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
 * @param {string} payload.startTime - Start time (ISO datetime string)
 * @param {string} payload.endTime - End time (ISO datetime string)
 * @returns {Promise<Object>} Created show object
 */
export const createShow = async (payload) => {
  if (!payload) {
    throw new Error("Show data is required");
  }

  if (!payload.movieId || !payload.screenId || !payload.startTime || !payload.endTime) {
    throw new Error("movieId, screenId, startTime, and endTime are required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }
    console.log(payload.movieId);
    const response = await axiosBookingInstance.post("/booking/owner/shows", {
      movieId: payload.movieId,
      screenId: Number(payload.screenId),
      startTime: payload.startTime, 
      endTime: payload.endTime, 
    }, {
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
 * @param {Object} payload - Updated show data
 * @param {string|number} payload.showId - Show ID to update
 * @param {string|number} [payload.movieId] - Movie ID
 * @param {string} [payload.startTime] - Start time (ISO datetime string)
 * @param {string} [payload.endTime] - End time (ISO datetime string)
 * @returns {Promise<Object>} Updated show object
 */
export const updateShow = async (payload) => {
  if (!payload || !payload.showId) {
    throw new Error("showId is required for updating a show");
  }

  const { showId, movieId, screenId, startTime, endTime } = payload;

  const updatePayload = {};

  if (movieId !== undefined) {
    updatePayload.movieId = Number(movieId);
  }
  if (screenId !== undefined) {
    updatePayload.screenId = Number(screenId);
  }
  if (startTime !== undefined) {
    updatePayload.startTime = startTime;
  }
  if (endTime !== undefined) {
    updatePayload.endTime = endTime;
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new Error("Update data is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const showIdStr = String(showId);

    const response = await axiosBookingInstance.put(
      `/booking/owner/shows/${showIdStr}`,
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

    const response = await axiosBookingInstance.delete(`booking/owner/shows/${showId}`, {
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

// import axiosBookingInstance from "../config/axiosBookingInstance";

// export const getOwnerShows = async () => {
//   const token = localStorage.getItem("authToken");
//   const res = await axiosBookingInstance.get("/booking/owner/shows", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data || [];
// };

// export const createShow = async (payload) => {
//   const token = localStorage.getItem("authToken");
//   const res = await axiosBookingInstance.post(
//     "/booking/owner/shows",
//     {
//       movieId: payload.movieId,      // STRING
//       screenId: Number(payload.screenId),
//       startTime: payload.startTime,
//       endTime: payload.endTime,
//     },
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return res.data;
// };

// export const updateShow = async (payload) => {
//   const token = localStorage.getItem("authToken");
//   const { showId, movieId, screenId, startTime, endTime } = payload;

//   const body = {};
//   if (movieId) body.movieId = movieId;
//   if (screenId) body.screenId = Number(screenId);
//   if (startTime) body.startTime = startTime;
//   if (endTime) body.endTime = endTime;

//   const res = await axiosBookingInstance.put(
//     `/booking/owner/shows/${showId}`,
//     body,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return res.data;
// };

// export const deleteShow = async (showId) => {
//   const token = localStorage.getItem("authToken");
//   await axiosBookingInstance.delete(`/booking/owner/shows/${showId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };


