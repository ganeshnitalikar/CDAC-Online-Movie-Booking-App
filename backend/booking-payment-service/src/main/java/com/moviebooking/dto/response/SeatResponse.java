package com.moviebooking.dto.response;

import com.moviebooking.entity.Seat;
import com.moviebooking.entity.SeatType;

/**
 * Response DTO for Seat entity.
 */
public class SeatResponse {

    private Long id;
    private String seatLabel;
    private String rowLabel;
    private String fullLabel;
    private SeatType type;
    private boolean available;

    // Default constructor
    public SeatResponse() {
    }

    public SeatResponse(Long id, String seatLabel, String rowLabel, 
                        SeatType type, boolean available) {
        this.id = id;
        this.seatLabel = seatLabel;
        this.rowLabel = rowLabel;
        this.fullLabel = rowLabel + seatLabel;
        this.type = type;
        this.available = available;
    }

    /**
     * Factory method to create from entity with availability.
     */
    public static SeatResponse fromEntity(Seat seat, boolean available) {
        return new SeatResponse(
            seat.getId(),
            seat.getSeatLabel(),
            seat.getRowLabel(),
            seat.getType(),
            available
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatLabel() {
        return seatLabel;
    }

    public void setSeatLabel(String seatLabel) {
        this.seatLabel = seatLabel;
    }

    public String getRowLabel() {
        return rowLabel;
    }

    public void setRowLabel(String rowLabel) {
        this.rowLabel = rowLabel;
    }

    public String getFullLabel() {
        return fullLabel;
    }

    public void setFullLabel(String fullLabel) {
        this.fullLabel = fullLabel;
    }

    public SeatType getType() {
        return type;
    }

    public void setType(SeatType type) {
        this.type = type;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
