package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.BookingInitiateRequest;
import com.cineverse.booking.dto.response.BookingSummaryResponse;
import com.cineverse.booking.dto.response.TicketResponse;
import com.cineverse.booking.dto.response.UserBookingResponse;
import com.cineverse.booking.entity.*;
import com.cineverse.booking.exception.BookingExpiredException;
import com.cineverse.booking.exception.SeatAlreadyLockedException;
import com.cineverse.booking.repository.BookingRepository;
import com.cineverse.booking.repository.PaymentRepository;
import com.cineverse.booking.repository.SeatRepository;
import com.cineverse.booking.repository.ShowRepository;
import com.cineverse.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;
    private final PaymentRepository paymentRepository;

    private static final int LOCK_MINUTES = 10;

    @Override
    @Transactional
    public BookingSummaryResponse initiateBooking(BookingInitiateRequest request, String userId) {

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        Set<Seat> seats = seatRepository.findByIdIn(request.getSeatIds());

        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Invalid seats selected");
        }
        boolean invalidSeat =
                seats.stream()
                     .anyMatch(seat ->
                         !seat.getScreen().getId()
                              .equals(show.getScreen().getId())
                     );

        if (invalidSeat) {
            throw new RuntimeException("One or more seats do not belong to this show");
        }

        // 🔐 seat lock check (DB level)
        boolean locked = !bookingRepository.findActiveSeatLocks(
                show.getId(),
                request.getSeatIds(),
                LocalDateTime.now()
        ).isEmpty();

        if (locked) {
            throw new SeatAlreadyLockedException("One or more seats already locked");
        }

        boolean alreadyBooked =
                !bookingRepository.findConfirmedSeatBookings(
                        show.getId(),
                        request.getSeatIds()
                ).isEmpty();

        if (alreadyBooked) {
            throw new SeatAlreadyLockedException(
                "One or more seats are already booked"
            );
        }
        
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setShow(show);
        booking.setSeats(seats);
        booking.setStatus(BookingStatus.INITIATED);
        booking.setLockExpiryTime(LocalDateTime.now().plusMinutes(LOCK_MINUTES));

        booking = bookingRepository.save(booking);

        BookingSummaryResponse response = new BookingSummaryResponse();
        response.setBookingId(booking.getId());
        response.setShowMovieId(show.getMovieId());
        response.setSeats(
                seats.stream()
                .map(Seat::getSeatLabel)
                        .collect(Collectors.toSet())
        );
        response.setStatus(booking.getStatus().name());
        response.setLockExpiryTime(booking.getLockExpiryTime());
        int amount = seats.stream()
                .mapToInt(seat ->
                    seat.getType() == SeatType.PREMIUM ? 30000 : 20000
                )
                .sum();
        response.setAmount(amount);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicket(Long bookingId, String userId) {

        Booking booking = bookingRepository
                .findByIdWithShowAndSeats(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BookingExpiredException("Booking not confirmed");
        }

        TicketResponse response = new TicketResponse();
        response.setBookingId(booking.getId());
        response.setMovieId(booking.getShow().getMovieId());
        response.setTheatreName(
                booking.getShow().getScreen().getTheatre().getName()
        );
        response.setScreenName(
                booking.getShow().getScreen().getName()
        );
        response.setShowStartTime(booking.getShow().getStartTime());

        response.setSeats(
                booking.getSeats()
                        .stream()
                        .map(Seat::getSeatLabel)
                        .toList()
        );

        return response;
    }

    @Override
    @Transactional
    public void expireBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.INITIATED &&
            booking.getLockExpiryTime().isBefore(LocalDateTime.now())) {

            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserBookingResponse> getBookingsByUser(String userId) {

        List<Booking> bookings =
                bookingRepository.findByUserIdOrderByIdDesc(userId);

        return bookings.stream()
                .map(booking -> {

                    Show show = booking.getShow();
                    Screen screen = show.getScreen();
                    Theatre theatre = screen.getTheatre();

                    List<String> seatLabels = booking.getSeats()
                            .stream()
                            .map(Seat::getSeatLabel)
                            .toList();

                    int amountPaid = paymentRepository
                            .findByBookingId(booking.getId())
                            .map(Payment::getAmount)
                            .orElse(0);

                    return new UserBookingResponse(
                            booking.getId(),
                            show.getMovieId(),
                            theatre.getName(),
                            screen.getName(),
                            show.getStartTime(),
                            show.getEndTime(),
                            seatLabels,
                            booking.getStatus().name(),
                            amountPaid
                    );
                })
                .toList();
    }

}
