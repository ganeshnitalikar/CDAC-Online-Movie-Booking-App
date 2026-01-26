package com.moviebooking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a new screen in a theatre.
 * Used by THEATRE_OWNER to add screens.
 */
public class CreateScreenRequest {

    @NotBlank(message = "Screen name is required")
    @Size(min = 1, max = 50, message = "Screen name must be between 1 and 50 characters")
    private String name;

    @NotNull(message = "Theatre ID is required")
    private Long theatreId;

    // Default constructor
    public CreateScreenRequest() {
    }

    public CreateScreenRequest(String name, Long theatreId) {
        this.name = name;
        this.theatreId = theatreId;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getTheatreId() {
        return theatreId;
    }

    public void setTheatreId(Long theatreId) {
        this.theatreId = theatreId;
    }
}
