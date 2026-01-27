package com.moviebooking.exception;

/**
 * Exception thrown when an invalid operation is attempted.
 * Examples: overlapping shows, duplicate bookings, etc.
 * Results in HTTP 400 (Bad Request) status.
 */
public class InvalidOperationException extends RuntimeException {

    public InvalidOperationException(String message) {
        super(message);
    }
}
