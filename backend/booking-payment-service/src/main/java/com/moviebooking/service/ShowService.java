package com.moviebooking.service;

import com.moviebooking.dto.request.CreateShowRequest;
import com.moviebooking.dto.response.ShowResponse;
import com.moviebooking.dto.response.ShowSeatAvailabilityResponse;
import java.util.List;

/**
 * Service interface for show operations.
 */
public interface ShowService {

    /**
     * Create a new show.
     * Only THEATRE_OWNER of the theatre can create shows.
     */
    ShowResponse createShow(CreateShowRequest request, String userId);

    /**
     * Get show by ID.
     */
    ShowResponse getShowById(Long id);

    /**
     * Get all shows for a movie in a city.
     */
    List<ShowResponse> getShowsByMovieAndCity(String movieId, String city);

    /**
     * Get all shows for a theatre.
     */
    List<ShowResponse> getShowsByTheatreId(Long theatreId);

    /**
     * Get seat availability for a show.
     * Returns all seats with their availability status.
     */
    ShowSeatAvailabilityResponse getShowSeatAvailability(Long showId);
}
