package com.moviebooking.service;

import com.moviebooking.dto.request.BookingInitiateRequest;
import com.moviebooking.dto.response.BookingSummaryResponse;
import com.moviebooking.dto.response.TicketResponse;
import java.util.List;

/**
 * Service interface for booking operations.
 * Handles seat locking and booking lifecycle.
 */
public interface BookingService {

    /**
     * Initiate a booking by locking seats.
     * Creates a booking in INITIATED status with a lock expiry time.
     * 
     * CRITICAL: This operation must handle concurrency properly.
     * Uses database-level locking to prevent double booking.
     */
    BookingSummaryResponse initiateBooking(BookingInitiateRequest request, String userId);

    /**
     * Get booking by ID.
     * Only the booking owner can access their booking.
     */
    BookingSummaryResponse getBookingById(Long bookingId, String userId);

    /**
     * Get all bookings for a user.
     */
    List<BookingSummaryResponse> getUserBookings(String userId);

    /**
     * Get confirmed ticket for a booking.
     * Only returns ticket if booking is CONFIRMED.
     */
    TicketResponse getTicket(Long bookingId, String userId);

    /**
     * Confirm a booking after successful payment.
     * Changes status from INITIATED to CONFIRMED.
     */
    void confirmBooking(Long bookingId);

    /**
     * Mark a booking as expired.
     * Changes status from INITIATED to EXPIRED.
     */
    void expireBooking(Long bookingId);
}
