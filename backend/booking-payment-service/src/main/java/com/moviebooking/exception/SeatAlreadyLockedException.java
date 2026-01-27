package com.moviebooking.exception;

import java.util.Set;

/**
 * Exception thrown when attempting to book seats that are already locked.
 * Results in HTTP 409 (Conflict) status.
 */
public class SeatAlreadyLockedException extends RuntimeException {

    private final Set<Long> lockedSeatIds;

    public SeatAlreadyLockedException(String message) {
        super(message);
        this.lockedSeatIds = null;
    }

    public SeatAlreadyLockedException(String message, Set<Long> lockedSeatIds) {
        super(message);
        this.lockedSeatIds = lockedSeatIds;
    }

    public Set<Long> getLockedSeatIds() {
        return lockedSeatIds;
    }
}
