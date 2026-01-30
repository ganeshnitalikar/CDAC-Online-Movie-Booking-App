import axiosPublicInstance from "../config/axiosPublicInstance";

/**
 * Public Movie Service
 * Handles unauthenticated movie API calls
 * Base path: /api/public/movies
 */

/**
 * Get list of approved and active movies
 * GET /api/public/movies
 *  return Array of movie objects
 */
export const getPublicMovies = async () => {
  try {
    const response = await axiosPublicInstance.get("/api/public/movies");
    console.log(response.data);
    console.log("response " , response);
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching public movies:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch movies. Please try again.");
  }
};

/**
 * Get movie details by ID
 * GET /api/public/movies/{movieId}
 *  movieId - Movie ID
 *  return Movie object with full details
 */
export const getMovieById = async (movieId) => {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  try {
    const response = await axiosPublicInstance.get(`/api/public/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    if (error.response?.status === 404) {
      throw new Error("Movie not found");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch movie details. Please try again.");
  }
};
