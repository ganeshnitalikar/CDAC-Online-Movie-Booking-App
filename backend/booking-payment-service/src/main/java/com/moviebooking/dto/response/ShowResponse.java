package com.moviebooking.dto.response;

import com.moviebooking.entity.Show;
import java.time.LocalDateTime;

/**
 * Response DTO for Show entity.
 */
public class ShowResponse {

    private Long id;
    private String movieId;
    private Long screenId;
    private String screenName;
    private Long theatreId;
    private String theatreName;
    private String city;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer normalSeatPrice;
    private Integer premiumSeatPrice;

    // Default constructor
    public ShowResponse() {
    }

    /**
     * Factory method to create from entity.
     */
    public static ShowResponse fromEntity(Show show) {
        ShowResponse response = new ShowResponse();
        response.setId(show.getId());
        response.setMovieId(show.getMovieId());
        response.setScreenId(show.getScreen().getId());
        response.setScreenName(show.getScreen().getName());
        response.setTheatreId(show.getScreen().getTheatre().getId());
        response.setTheatreName(show.getScreen().getTheatre().getName());
        response.setCity(show.getScreen().getTheatre().getCity());
        response.setStartTime(show.getStartTime());
        response.setEndTime(show.getEndTime());
        response.setNormalSeatPrice(show.getNormalSeatPrice());
        response.setPremiumSeatPrice(show.getPremiumSeatPrice());
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public Long getTheatreId() {
        return theatreId;
    }

    public void setTheatreId(Long theatreId) {
        this.theatreId = theatreId;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
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
