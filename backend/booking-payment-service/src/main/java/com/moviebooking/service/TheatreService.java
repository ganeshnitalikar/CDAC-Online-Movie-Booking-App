package com.moviebooking.service;

import com.moviebooking.dto.request.CreateTheatreRequest;
import com.moviebooking.dto.response.TheatreResponse;
import java.util.List;

/**
 * Service interface for theatre operations.
 */
public interface TheatreService {

    /**
     * Create a new theatre.
     * Only ADMIN can create theatres.
     */
    TheatreResponse createTheatre(CreateTheatreRequest request);

    /**
     * Get theatre by ID.
     */
    TheatreResponse getTheatreById(Long id);

    /**
     * Get all theatres.
     */
    List<TheatreResponse> getAllTheatres();

    /**
     * Get theatres by city.
     */
    List<TheatreResponse> getTheatresByCity(String city);

    /**
     * Get theatres owned by a specific owner.
     */
    List<TheatreResponse> getTheatresByOwnerId(String ownerId);

    /**
     * Check if user owns the theatre.
     */
    boolean isTheatreOwner(Long theatreId, String userId);
}
