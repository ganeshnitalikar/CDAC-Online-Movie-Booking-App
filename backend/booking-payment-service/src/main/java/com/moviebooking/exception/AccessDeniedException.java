package com.moviebooking.exception;

/**
 * Exception thrown when user tries to access a resource they don't own.
 * Results in HTTP 403 (Forbidden) status.
 */
public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException(String message) {
        super(message);
    }

    public AccessDeniedException(String resourceType, Long resourceId) {
        super(String.format("Access denied to %s with id: %d", resourceType, resourceId));
    }
}
