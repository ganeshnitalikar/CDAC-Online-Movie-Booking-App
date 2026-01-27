package com.moviebooking.service;

import com.moviebooking.dto.request.CreateScreenRequest;
import com.moviebooking.dto.request.SeatLayoutRequest;
import com.moviebooking.dto.response.ScreenResponse;
import com.moviebooking.dto.response.SeatResponse;
import java.util.List;

/**
 * Service interface for screen operations.
 */
public interface ScreenService {

    /**
     * Create a new screen in a theatre.
     * Only THEATRE_OWNER of the theatre can create screens.
     */
    ScreenResponse createScreen(CreateScreenRequest request, String userId);

    /**
     * Get screen by ID.
     */
    ScreenResponse getScreenById(Long id);

    /**
     * Get all screens in a theatre.
     */
    List<ScreenResponse> getScreensByTheatreId(Long theatreId);

    /**
     * Configure seat layout for a screen.
     * Only THEATRE_OWNER of the theatre can configure seats.
     */
    List<SeatResponse> configureSeatLayout(SeatLayoutRequest request, String userId);

    /**
     * Get all seats for a screen.
     */
    List<SeatResponse> getSeatsByScreenId(Long screenId);
}
