package com.cineverse.booking.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ---------- 404 ----------
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildError(ex, HttpStatus.NOT_FOUND, request);
    }

    // ---------- 409 ----------
    @ExceptionHandler(SeatAlreadyLockedException.class)
    public ResponseEntity<ErrorResponse> handleSeatLocked(
            SeatAlreadyLockedException ex,
            HttpServletRequest request
    ) {
        return buildError(ex, HttpStatus.CONFLICT, request);
    }

    // ---------- 410 ----------
    @ExceptionHandler(BookingExpiredException.class)
    public ResponseEntity<ErrorResponse> handleBookingExpired(
            BookingExpiredException ex,
            HttpServletRequest request
    ) {
        return buildError(ex, HttpStatus.GONE, request);
    }

    // ---------- 403 ----------
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request
    ) {
        return buildError(ex, HttpStatus.FORBIDDEN, request);
    }

    // ---------- 400 ----------
    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<ErrorResponse> handlePayment(
            PaymentException ex,
            HttpServletRequest request
    ) {
        return buildError(ex, HttpStatus.BAD_REQUEST, request);
    }

    // ---------- VALIDATION ----------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return buildError(
                new RuntimeException(message),
                HttpStatus.BAD_REQUEST,
                request
        );
    }

    // ---------- FALLBACK ----------
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildError(ex, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // ---------- COMMON BUILDER ----------
    private ResponseEntity<ErrorResponse> buildError(
            Exception ex,
            HttpStatus status,
            HttpServletRequest request
    ) {
        ErrorResponse error = new ErrorResponse();
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(status.value());
        error.setError(status.getReasonPhrase());
        error.setMessage(ex.getMessage());
        error.setPath(request.getRequestURI());

        return new ResponseEntity<>(error, status);
    }
}
