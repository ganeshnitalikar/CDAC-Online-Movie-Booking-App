package com.cineverse.booking.exception;

public class SeatAlreadyLockedException extends RuntimeException {

    public SeatAlreadyLockedException(String message) {
        super(message);
    }
}
