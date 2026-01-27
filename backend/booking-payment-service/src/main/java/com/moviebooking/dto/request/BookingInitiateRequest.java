package com.moviebooking.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

/**
 * DTO for initiating a booking.
 * Used by USER to lock seats and start booking process.
 */
public class BookingInitiateRequest {

    @NotNull(message = "Show ID is required")
    private Long showId;

    @NotEmpty(message = "At least one seat must be selected")
    private Set<Long> seatIds;

    // Default constructor
    public BookingInitiateRequest() {
    }

    public BookingInitiateRequest(Long showId, Set<Long> seatIds) {
        this.showId = showId;
        this.seatIds = seatIds;
    }

    // Getters and Setters
    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public Set<Long> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(Set<Long> seatIds) {
        this.seatIds = seatIds;
    }
}
