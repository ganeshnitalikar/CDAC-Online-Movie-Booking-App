package com.moviebooking.dto.response;

import com.moviebooking.entity.Booking;
import com.moviebooking.entity.BookingStatus;
import com.moviebooking.entity.Seat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Response DTO for Booking summary.
 * Returned when booking is initiated.
 */
public class BookingSummaryResponse {

    private Long bookingId;
    private Long showId;
    private String movieId;
    private String theatreName;
    private String screenName;
    private LocalDateTime showTime;
    private List<String> seatLabels;
    private Integer totalAmount;
    private BookingStatus status;
    private LocalDateTime lockExpiryTime;
    private LocalDateTime createdAt;

    // Default constructor
    public BookingSummaryResponse() {
    }

    /**
     * Factory method to create from entity.
     */
    public static BookingSummaryResponse fromEntity(Booking booking) {
        BookingSummaryResponse response = new BookingSummaryResponse();
        response.setBookingId(booking.getId());
        response.setShowId(booking.getShow().getId());
        response.setMovieId(booking.getShow().getMovieId());
        response.setTheatreName(booking.getShow().getScreen().getTheatre().getName());
        response.setScreenName(booking.getShow().getScreen().getName());
        response.setShowTime(booking.getShow().getStartTime());
        response.setSeatLabels(
            booking.getSeats().stream()
                .map(Seat::getFullSeatLabel)
                .sorted()
                .collect(Collectors.toList())
        );
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getStatus());
        response.setLockExpiryTime(booking.getLockExpiryTime());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }

    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

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

    public LocalDateTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalDateTime showTime) {
        this.showTime = showTime;
    }

    public List<String> getSeatLabels() {
        return seatLabels;
    }

    public void setSeatLabels(List<String> seatLabels) {
        this.seatLabels = seatLabels;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getLockExpiryTime() {
        return lockExpiryTime;
    }

    public void setLockExpiryTime(LocalDateTime lockExpiryTime) {
        this.lockExpiryTime = lockExpiryTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
