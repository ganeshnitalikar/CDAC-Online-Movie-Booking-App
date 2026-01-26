package com.cineverse.booking.service;

import java.util.List;

import com.cineverse.booking.dto.request.BookingInitiateRequest;
import com.cineverse.booking.dto.response.BookingSummaryResponse;
import com.cineverse.booking.dto.response.TicketResponse;
import com.cineverse.booking.dto.response.UserBookingResponse;

public interface BookingService {

    BookingSummaryResponse initiateBooking(
            BookingInitiateRequest request,
            String userId
    );

    TicketResponse getTicket(Long bookingId, String userId);

    void expireBooking(Long bookingId);
    List<UserBookingResponse> getBookingsByUser(String userId);

}
