import axiosMovieInstance from "../config/axiosMovieInstance";

/**
 * Owner Movie Service
 * Handles authenticated movie API calls for OWNER role
 * Base path: /api/owner/movies
 * Requires: JWT token with role = OWNER
 */

/**
 * Get all movies owned by the current owner
 * GET /api/owner/movies
  *  return Array of movie objects owned by the owner
 */
export const getOwnerMovies = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosMovieInstance.get("/api/owner/movies" ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching owner movies:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view movies. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch your movies. Please try again.");
  }
};

/**
 * Get a specific movie by ID (for editing)
 * GET /api/owner/movies/{movieId}
 *  movieId - Movie ID
 *  return Movie object
 */
export const getOwnerMovieById = async (movieId) => {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosMovieInstance.get(`/api/owner/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to view this movie.");
    }
    if (error.response?.status === 404) {
      throw new Error("Movie not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch movie details. Please try again.");
  }
};

/**
 * Create a new movie
 * POST /api/owner/movies
 *  payload - Movie data
 *  payload.title - Movie title
 *  payload.description - Movie description
 *  payload.genre - Array of genres
 *  payload.releaseDate - Release date (ISO format)
 *  payload.durationMinutes - Duration in minutes
 *  payload.language - Language
 *  payload.certificate - Certificate rating
 *  payload.posterUrl - Poster image URL
 *  payload.backdropUrl - Backdrop image URL
 *  payload.rating - Rating (optional)
 *  return Created movie object
 */
export const createMovie = async (payload) => {
  if (!payload) {
    throw new Error("Movie data is required");
  }

  if (!payload.title || !payload.description) {
    throw new Error("Title and description are required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }
    console.log(payload);
    const response = await axiosMovieInstance.post("/api/owner/movies", payload);

    return response.data;
  } catch (error) {
    console.error("Error creating movie:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to create movies. Owner role required.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create movie. Please try again.");
  }
};

/**
 * Update an existing movie
 * PUT /api/owner/movies/{movieId}
 *  movieId - Movie ID to update
 *  payload - Updated movie data (partial update supported)
 *  return Updated movie object
 */
export const updateMovie = async (movieId, payload) => {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("Update data is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    // Ensure movieId is a string
    const movieIdStr = String(movieId);
    
    // Log for debugging
    console.log("Updating movie:", movieIdStr);
    console.log("Update payload:", JSON.stringify(payload, null, 2));

    // axiosMovieInstance interceptor already adds the Authorization header
    const response = await axiosMovieInstance.put(
      `/api/owner/movies/${movieIdStr}`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to update this movie. Owner role required.");
    }
    if (error.response?.status === 404) {
      throw new Error("Movie not found");
    }
    if (error.response?.status === 500) {
      // Log the actual server error for debugging
      console.error("Server error details:", error.response?.data);
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(serverMessage || "Internal server error. Please check the console for details.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update movie. Please try again.");
  }
};

/**
 * Delete a movie
 * DELETE /api/owner/movies/{movieId}
 *  movieId - Movie ID to delete
 *  return Success response
 */
export const deleteMovie = async (movieId) => {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await axiosMovieInstance.delete(`/api/owner/movies/${movieId}`);

    return response.data || { success: true, message: "Movie deleted successfully" };
  } catch (error) {
    console.error("Error deleting movie:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("You don't have permission to delete this movie. Owner role required.");
    }
    if (error.response?.status === 404) {
      throw new Error("Movie not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete movie. Please try again.");
  }
};
