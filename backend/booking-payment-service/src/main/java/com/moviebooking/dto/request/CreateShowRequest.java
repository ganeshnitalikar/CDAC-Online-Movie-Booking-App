package com.moviebooking.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * DTO for creating a new show.
 * Used by THEATRE_OWNER to schedule shows.
 */
public class CreateShowRequest {

    @NotBlank(message = "Movie ID is required")
    private String movieId;

    @NotNull(message = "Screen ID is required")
    private Long screenId;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    /**
     * Price for NORMAL seats in paise (e.g., 20000 = Rs. 200)
     */
    @NotNull(message = "Normal seat price is required")
    @Min(value = 100, message = "Normal seat price must be at least 100 paise (Rs. 1)")
    private Integer normalSeatPrice;

    /**
     * Price for PREMIUM seats in paise (e.g., 35000 = Rs. 350)
     */
    @NotNull(message = "Premium seat price is required")
    @Min(value = 100, message = "Premium seat price must be at least 100 paise (Rs. 1)")
    private Integer premiumSeatPrice;

    // Default constructor
    public CreateShowRequest() {
    }

    public CreateShowRequest(String movieId, Long screenId, LocalDateTime startTime, 
                             LocalDateTime endTime, Integer normalSeatPrice, 
                             Integer premiumSeatPrice) {
        this.movieId = movieId;
        this.screenId = screenId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.normalSeatPrice = normalSeatPrice;
        this.premiumSeatPrice = premiumSeatPrice;
    }

    // Getters and Setters
    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public Long getScreenId() {
        return screenId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getNormalSeatPrice() {
        return normalSeatPrice;
    }

    public void setNormalSeatPrice(Integer normalSeatPrice) {
        this.normalSeatPrice = normalSeatPrice;
    }

    public Integer getPremiumSeatPrice() {
        return premiumSeatPrice;
    }

    public void setPremiumSeatPrice(Integer premiumSeatPrice) {
        this.premiumSeatPrice = premiumSeatPrice;
    }
}
