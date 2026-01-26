package com.cineverse.booking.controller.user;

import com.cineverse.booking.dto.request.BookingInitiateRequest;
import com.cineverse.booking.dto.response.BookingSummaryResponse;
import com.cineverse.booking.dto.response.TicketResponse;
import com.cineverse.booking.dto.response.UserBookingResponse;
import com.cineverse.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking/user/bookings")
@RequiredArgsConstructor
public class UserBookingController {

    private final BookingService bookingService;
    
    @GetMapping("/test")
    public String test() {
    	return "Success";
    }

    @PostMapping("/initiate")
    public BookingSummaryResponse initiateBooking(
            @Valid @RequestBody BookingInitiateRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return bookingService.initiateBooking(
                request,
                jwt.getSubject()
        );
    }

    @GetMapping("/{bookingId}/ticket")
    public TicketResponse getTicket(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return bookingService.getTicket(
                bookingId,
                jwt.getSubject()
        );
    }
    
    @GetMapping
    public List<UserBookingResponse> getUserBookings(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return bookingService.getBookingsByUser(jwt.getSubject());
    }
}
