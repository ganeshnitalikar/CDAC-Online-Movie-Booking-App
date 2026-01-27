package com.moviebooking.controller;

import com.moviebooking.config.JwtUserDetails;
import com.moviebooking.dto.request.BookingInitiateRequest;
import com.moviebooking.dto.request.PaymentVerifyRequest;
import com.moviebooking.dto.response.BookingSummaryResponse;
import com.moviebooking.dto.response.RazorpayOrderResponse;
import com.moviebooking.dto.response.TicketResponse;
import com.moviebooking.service.BookingService;
import com.moviebooking.service.PaymentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Controller for USER operations.
 * 
 * USER can:
 * - View shows
 * - Initiate booking
 * - Make payment
 * - View ticket
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final JwtUserDetails jwtUserDetails;

    public UserController(BookingService bookingService,
                          PaymentService paymentService,
                          JwtUserDetails jwtUserDetails) {
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.jwtUserDetails = jwtUserDetails;
    }

    /**
     * Initiate a booking by selecting seats.
     * This locks the seats for 10 minutes.
     */
    @PostMapping("/bookings")
    public ResponseEntity<BookingSummaryResponse> initiateBooking(
            @Valid @RequestBody BookingInitiateRequest request) {
        
        String userId = jwtUserDetails.getCurrentUserId();
        logger.info("User {} initiating booking for show {}", userId, request.getShowId());
        
        BookingSummaryResponse response = bookingService.initiateBooking(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all bookings for the current user.
     */
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingSummaryResponse>> getMyBookings() {
        String userId = jwtUserDetails.getCurrentUserId();
        List<BookingSummaryResponse> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get a specific booking by ID.
     */
    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<BookingSummaryResponse> getBooking(@PathVariable Long bookingId) {
        String userId = jwtUserDetails.getCurrentUserId();
        BookingSummaryResponse booking = bookingService.getBookingById(bookingId, userId);
        return ResponseEntity.ok(booking);
    }

    /**
     * Create a payment order for a booking.
     * Returns Razorpay order details for frontend to initiate payment.
     */
    @PostMapping("/bookings/{bookingId}/payment")
    public ResponseEntity<RazorpayOrderResponse> createPaymentOrder(
            @PathVariable Long bookingId) {
        
        String userId = jwtUserDetails.getCurrentUserId();
        logger.info("User {} creating payment order for booking {}", userId, bookingId);
        
        RazorpayOrderResponse response = paymentService.createPaymentOrder(bookingId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify payment and complete booking.
     * Called after successful Razorpay payment from frontend.
     */
    @PostMapping("/payment/verify")
    public ResponseEntity<Void> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {
        
        String userId = jwtUserDetails.getCurrentUserId();
        logger.info("User {} verifying payment for order {}", userId, request.getRazorpayOrderId());
        
        paymentService.verifyAndCompletePayment(request, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Get ticket for a confirmed booking.
     */
    @GetMapping("/bookings/{bookingId}/ticket")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Long bookingId) {
        String userId = jwtUserDetails.getCurrentUserId();
        TicketResponse ticket = bookingService.getTicket(bookingId, userId);
        return ResponseEntity.ok(ticket);
    }
}
