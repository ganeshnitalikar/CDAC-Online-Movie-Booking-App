package com.moviebooking.dto.response;

import com.moviebooking.entity.Booking;
import com.moviebooking.entity.BookingStatus;
import com.moviebooking.entity.Seat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Response DTO for confirmed ticket.
 * This is what the user sees after successful payment.
 */
public class TicketResponse {

    private Long ticketId;
    private String movieId;
    private String theatreName;
    private String theatreCity;
    private String screenName;
    private LocalDateTime showTime;
    private List<SeatInfo> seats;
    private Integer totalAmount;
    private String paymentId;
    private BookingStatus status;
    private LocalDateTime bookedAt;

    // Default constructor
    public TicketResponse() {
    }

    /**
     * Factory method to create from booking entity.
     */
    public static TicketResponse fromBooking(Booking booking) {
        TicketResponse response = new TicketResponse();
        response.setTicketId(booking.getId());
        response.setMovieId(booking.getShow().getMovieId());
        response.setTheatreName(booking.getShow().getScreen().getTheatre().getName());
        response.setTheatreCity(booking.getShow().getScreen().getTheatre().getCity());
        response.setScreenName(booking.getShow().getScreen().getName());
        response.setShowTime(booking.getShow().getStartTime());
        response.setSeats(
            booking.getSeats().stream()
                .map(seat -> new SeatInfo(
                    seat.getFullSeatLabel(),
                    seat.getType().name()
                ))
                .sorted((a, b) -> a.getLabel().compareTo(b.getLabel()))
                .collect(Collectors.toList())
        );
        response.setTotalAmount(booking.getTotalAmount());
        if (booking.getPayment() != null) {
            response.setPaymentId(booking.getPayment().getRazorpayPaymentId());
        }
        response.setStatus(booking.getStatus());
        response.setBookedAt(booking.getCreatedAt());
        return response;
    }

    // Getters and Setters
    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
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

    public String getTheatreCity() {
        return theatreCity;
    }

    public void setTheatreCity(String theatreCity) {
        this.theatreCity = theatreCity;
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

    public List<SeatInfo> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatInfo> seats) {
        this.seats = seats;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    /**
     * Nested class for seat information in ticket.
     */
    public static class SeatInfo {
        private String label;
        private String type;

        public SeatInfo() {
        }

        public SeatInfo(String label, String type) {
            this.label = label;
            this.type = type;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
