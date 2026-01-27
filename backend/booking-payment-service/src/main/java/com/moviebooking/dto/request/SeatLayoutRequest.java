package com.moviebooking.dto.request;

import com.moviebooking.entity.SeatType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * DTO for setting up seat layout for a screen.
 * Used by THEATRE_OWNER to configure seats.
 */
public class SeatLayoutRequest {

    @NotNull(message = "Screen ID is required")
    private Long screenId;

    @NotEmpty(message = "At least one seat row is required")
    @Valid
    private List<SeatRowRequest> rows;

    // Default constructor
    public SeatLayoutRequest() {
    }

    public SeatLayoutRequest(Long screenId, List<SeatRowRequest> rows) {
        this.screenId = screenId;
        this.rows = rows;
    }

    // Getters and Setters
    public Long getScreenId() {
        return screenId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public List<SeatRowRequest> getRows() {
        return rows;
    }

    public void setRows(List<SeatRowRequest> rows) {
        this.rows = rows;
    }

    /**
     * Nested class representing a row of seats.
     */
    public static class SeatRowRequest {

        @NotBlank(message = "Row label is required")
        private String rowLabel;

        @NotNull(message = "Number of seats is required")
        private Integer numberOfSeats;

        @NotNull(message = "Seat type is required")
        private SeatType seatType;

        // Default constructor
        public SeatRowRequest() {
        }

        public SeatRowRequest(String rowLabel, Integer numberOfSeats, SeatType seatType) {
            this.rowLabel = rowLabel;
            this.numberOfSeats = numberOfSeats;
            this.seatType = seatType;
        }

        // Getters and Setters
        public String getRowLabel() {
            return rowLabel;
        }

        public void setRowLabel(String rowLabel) {
            this.rowLabel = rowLabel;
        }

        public Integer getNumberOfSeats() {
            return numberOfSeats;
        }

        public void setNumberOfSeats(Integer numberOfSeats) {
            this.numberOfSeats = numberOfSeats;
        }

        public SeatType getSeatType() {
            return seatType;
        }

        public void setSeatType(SeatType seatType) {
            this.seatType = seatType;
        }
    }
}
