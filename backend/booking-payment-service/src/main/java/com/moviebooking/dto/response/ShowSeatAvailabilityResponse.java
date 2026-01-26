package com.moviebooking.dto.response;

import java.util.List;
import java.util.Map;

/**
 * Response DTO for show seat availability.
 * Groups seats by row for easy frontend rendering.
 */
public class ShowSeatAvailabilityResponse {

    private Long showId;
    private String movieId;
    private String theatreName;
    private String screenName;
    private Integer normalSeatPrice;
    private Integer premiumSeatPrice;
    private Map<String, List<SeatResponse>> seatsByRow;
    private int totalSeats;
    private int availableSeats;

    // Default constructor
    public ShowSeatAvailabilityResponse() {
    }

    // Getters and Setters
    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
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

    public Map<String, List<SeatResponse>> getSeatsByRow() {
        return seatsByRow;
    }

    public void setSeatsByRow(Map<String, List<SeatResponse>> seatsByRow) {
        this.seatsByRow = seatsByRow;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
}
