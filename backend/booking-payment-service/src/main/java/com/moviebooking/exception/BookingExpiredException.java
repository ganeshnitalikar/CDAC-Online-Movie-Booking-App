package com.moviebooking.exception;

/**
 * Exception thrown when attempting to pay for an expired booking.
 * Results in HTTP 410 (Gone) status.
 */
public class BookingExpiredException extends RuntimeException {

    private final Long bookingId;

    public BookingExpiredException(String message) {
        super(message);
        this.bookingId = null;
    }

    public BookingExpiredException(String message, Long bookingId) {
        super(message);
        this.bookingId = bookingId;
    }

    public Long getBookingId() {
        return bookingId;
    }
}
