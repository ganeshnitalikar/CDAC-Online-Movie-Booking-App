import axiosBookingInstance from "../config/axiosBookingInstance";

/**
 * Owner Screen Service
 * Handles screen management API calls for OWNER role
 * Base URL: http://localhost:8080
 */

/**
 * Get all screens for the current owner's theatre
 * GET /owner/screens
 *  return Array of screen objects
 */
export const getOwnerScreens = async () => {
  try {
    const token = localStorage.getItem("authToken");
   
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.get("/booking/owner/screens",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching owner screens:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view screens. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch screens. Please try again.");
  }
};

/**
 * Get a specific screen by ID
 * GET /owner/screens/{screenId}
 *  screenId - Screen ID
 *  return Screen object
 */
export const getOwnerScreenById = async (screenId) => {
  if (!screenId) {
    throw new Error("Screen ID is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    console.log("token", token);
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.get(`/booking/owner/screens/${screenId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching screen details:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view this screen.");
    }
    if (error.response?.status === 404) {
      throw new Error("Screen not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch screen details. Please try again.");
  }
};

/**
 * Create a new screen
 * POST /owner/screens
 *  payload - Screen data
 *  payload.name - Screen name
 *  payload.capacity - Screen capacity (number of seats)
 *  payload.features - Screen features (comma-separated or string)
 *  return Created screen object
 */
export const createScreen = async (payload) => {
  if (!payload) {
    throw new Error("Screen data is required");
  }

  if (!payload.name || !payload.theatreId) {
    throw new Error("Name and theatreId are required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }
    console.log(typeof(payload.features));
    const response = await axiosBookingInstance.post(
      "/booking/owner/screens",
      {
        name: payload.name.trim(),
        theatreId: payload.theatreId,
        capacity: payload.capacity,
        features: payload.features,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating screen:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to create screens. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create screen. Please try again.");
  }
};

/**
 * Update an existing screen
 * PUT /owner/screens/{screenId}
 *  screenId - Screen ID to update
 *  payload - Updated screen data (partial update supported)
 *  return Updated screen object
 */
export const updateScreen = async (screenId, payload) => {
  if (!screenId) {
    throw new Error("Screen ID is required");
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("Update data is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const screenIdStr = String(screenId);
    const updatePayload = {};
    
    if (payload.name !== undefined) {
      updatePayload.name = payload.name.trim();
    }
    if (payload.capacity !== undefined) {
      updatePayload.capacity = parseInt(payload.capacity, 10);
    }
    if (payload.features !== undefined) {
      updatePayload.features = payload.features.trim();
    }

    const response = await axiosBookingInstance.put(
      `booking/owner/screens/${screenIdStr}`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating screen:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to update this screen. Owner role required.");
    }
    if (error.response?.status === 404) {
      throw new Error("Screen not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update screen. Please try again.");
  }
};

/**
 * Delete a screen
 * DELETE /owner/screens/{screenId}
 *  screenId - Screen ID to delete
 *  return Success response
 */
export const deleteScreen = async (screenId) => {
  if (!screenId) {
    throw new Error("Screen ID is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

      const response = await axiosBookingInstance.delete(`/booking/owner/screens/${screenId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || { success: true, message: "Screen deleted successfully" };
  } catch (error) {
    console.error("Error deleting screen:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to delete this screen. Owner role required.");
    }
    if (error.response?.status === 404) {
      throw new Error("Screen not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete screen. Please try again.");
  }
};

/**
 * Get owner's theatre information
 * GET /owner/theatres
 *  return Theatre object with id (returns first theatre if array)
 */
export const getOwnerTheatre = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.get("/booking/owner/theatres",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // If response is an array, return first theatre, otherwise return the object
    const theatre = Array.isArray(response.data) ? response.data[0] : response.data;
    return theatre;
  } catch (error) {
    console.error("Error fetching owner theatre:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view theatre. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch theatre. Please try again.");
  }
};

/**
 * Get all owner's theatres
 * GET /owner/theatres
 *  return Array of theatre objects
 */
export const getOwnerTheatres = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.get("/booking/owner/theatres",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Always return an array
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching owner theatres:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view theatres. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch theatres. Please try again.");
  }
};

/**
 * Create a new theatre for the owner
 * POST /owner/theatres
 *  payload - Theatre data
 *  payload.name - Theatre name (required)
 *  payload.city - Theatre city
 *  payload.phone - Theatre phone number
 *  return Created theatre object
 */
export const createOwnerTheatre = async (payload) => {
  if (!payload) {
    throw new Error("Theatre data is required");
  }

  if (!payload.name || !payload.name.trim()) {
    throw new Error("Theatre name is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.post(
      "/booking/owner/theatres",
      {
        name: payload.name.trim(),
        city: payload.city?.trim() ?? "",
        phone: payload.phone?.trim() || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating theatre:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to create theatres. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create theatre. Please try again.");
  }
};

/**
 * Create a new screen for a specific theatre
 * POST /owner/theatres/{theatreId}/screens
 *  theatreId - Theatre ID
 *  payload - Screen data
 *  payload.name - Screen name (required)
 *  payload.normalPrice - Normal seat price (required, > 0)
 *  payload.premiumPrice - Premium seat price (required, > 0)
 *  return Created screen object
 */
export const createScreenForTheatre = async (theatreId, payload) => {
  if (!theatreId) {
    throw new Error("Theatre ID is required");
  }

  if (!payload) {
    throw new Error("Screen data is required");
  }

  if (!payload.name || !payload.name.trim()) {
    throw new Error("Screen name is required");
  }

  if (!payload.normalPrice || payload.normalPrice <= 0) {
    throw new Error("Normal price must be greater than 0");
  }

  if (!payload.premiumPrice || payload.premiumPrice <= 0) {
    throw new Error("Premium price must be greater than 0");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosBookingInstance.post(
      `/booking/owner/screens`,
      {
        theatreId: theatreId,
        name: payload.name.trim(),
        normalPrice: parseFloat(payload.normalPrice),
        premiumPrice: parseFloat(payload.premiumPrice),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating screen for theatre:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to create screens. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create screen. Please try again.");
  }
};
