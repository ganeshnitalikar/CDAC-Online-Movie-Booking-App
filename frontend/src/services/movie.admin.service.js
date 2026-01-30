import axiosMovieInstance from "../config/axiosMovieInstance";

/**
 * Admin Movie Service
 * Handles authenticated movie API calls for ADMIN role
 * Base path: /api/admin/movies
 * Requires: JWT token with role = ADMIN
 */

/**
 * Get list of movies pending approval
 * GET /api/admin/movies/pending
 *  return Array of pending movie objects
 */
export const getPendingMovies = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosMovieInstance.get("/api/admin/movies/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error("Error fetching pending movies:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view pending movies. Admin role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch pending movies. Please try again.");
  }
};

/**
 * Approve or reject a movie
 * PUT /api/admin/movies/{movieId}/approval
 *  movieId - Movie ID
 *  approvalData - Approval data
 *  approvalData.approved - true to approve, false to reject
 *  approvalData.remarks - Optional remarks/notes
 *  return Updated movie object
 */
export const approveMovie = async (movieId, approvalData) => {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  if (!approvalData || typeof approvalData.approved !== "boolean") {
    throw new Error("Approval status (approved: boolean) is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosMovieInstance.put(
      `/api/admin/movies/${movieId}/approval`,
      approvalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating movie approval:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to approve/reject movies. Admin role required.");
    }
    if (error.response?.status === 404) {
      throw new Error("Movie not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update movie approval. Please try again.");
  }
};
