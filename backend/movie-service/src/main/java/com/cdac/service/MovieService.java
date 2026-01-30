package com.cdac.service;

import java.util.List;

import com.cdac.dtos.request.AdminApprovalRequest;
import com.cdac.dtos.request.CreateMovieRequest;
import com.cdac.dtos.request.UpdateMovieRequest;
import com.cdac.dtos.response.MovieResponse;

public interface MovieService {

    /**
     * Public / USER access
     * Returns only approved and active movies
     */
    
    List<MovieResponse> getPublicMovies();

    MovieResponse getMovieById(String movieId);

    /**
     * THEATER_OWNER / ADMIN
     * Create a new movie
     */
    MovieResponse createMovie(CreateMovieRequest request, String userId, String role);

    /**
     * THEATER_OWNER (own movie) / ADMIN (any movie)
     */
    MovieResponse updateMovie(
            String movieId,
            UpdateMovieRequest request,
            String userId,
            String role
    );

    /**
     * THEATER_OWNER (own movie) / ADMIN (any movie)
     */
    void deleteMovie(String movieId, String userId, String role);

    /**
     * ADMIN only
     * Approve or reject a movie
     */
    MovieResponse approveMovie(
            String movieId,
            AdminApprovalRequest request,
            String adminUserId
    );

    /**
     * ADMIN only
     * View pending approval movies
     */
    List<MovieResponse> getPendingApprovalMovies();
    
    List<MovieResponse> searchPublicMovies(String keyword);

	List<MovieResponse> getOwnerMovies(String ownerId);
    
}
