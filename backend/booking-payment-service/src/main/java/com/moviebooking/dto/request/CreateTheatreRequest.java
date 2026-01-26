package com.moviebooking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a new theatre.
 * Used by ADMIN to onboard theatres.
 */
public class CreateTheatreRequest {

    @NotBlank(message = "Theatre name is required")
    @Size(min = 2, max = 100, message = "Theatre name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 50, message = "City must be between 2 and 50 characters")
    private String city;

    @NotBlank(message = "Owner ID is required")
    private String ownerId;

    // Default constructor
    public CreateTheatreRequest() {
    }

    public CreateTheatreRequest(String name, String city, String ownerId) {
        this.name = name;
        this.city = city;
        this.ownerId = ownerId;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }
}
