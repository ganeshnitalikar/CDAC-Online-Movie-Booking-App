package com.moviebooking.dto.response;

import com.moviebooking.entity.Theatre;

/**
 * Response DTO for Theatre entity.
 */
public class TheatreResponse {

    private Long id;
    private String name;
    private String city;
    private String ownerId;

    // Default constructor
    public TheatreResponse() {
    }

    public TheatreResponse(Long id, String name, String city, String ownerId) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.ownerId = ownerId;
    }

    /**
     * Factory method to create from entity.
     */
    public static TheatreResponse fromEntity(Theatre theatre) {
        return new TheatreResponse(
            theatre.getId(),
            theatre.getName(),
            theatre.getCity(),
            theatre.getOwnerId()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
