package com.moviebooking.service.impl;

import com.moviebooking.dto.request.BookingInitiateRequest;
import com.moviebooking.dto.response.BookingSummaryResponse;
import com.moviebooking.dto.response.TicketResponse;
import com.moviebooking.entity.Booking;
import com.moviebooking.entity.BookingStatus;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.exception.AccessDeniedException;
import com.moviebooking.exception.InvalidOperationException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.exception.SeatAlreadyLockedException;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of BookingService.
 * 
 * CRITICAL: This service handles seat locking with database-level concurrency control.
 * All seat locking operations use SERIALIZABLE isolation level to prevent race conditions.
 */
@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    @Value("${booking.seat.lock.duration.minutes:10}")
    private int lockDurationMinutes;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              ShowRepository showRepository,
                              SeatRepository seatRepository) {
        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
    }

    /**
     * Initiate a booking by locking seats.
     * 
     * CRITICAL: Uses SERIALIZABLE isolation to prevent double-booking.
     * The database will serialize concurrent transactions trying to book same seats.
     */
    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingSummaryResponse initiateBooking(BookingInitiateRequest request, String userId) {
        logger.info("Initiating booking for user: {}, show: {}, seats: {}", 
            userId, request.getShowId(), request.getSeatIds());

        // 1. Get and validate show
        Show show = showRepository.findById(request.getShowId())
            .orElseThrow(() -> new ResourceNotFoundException("Show", "id", request.getShowId()));

        // Check if show hasn't started yet
        if (show.getStartTime().isBefore(LocalDateTime.now())) {
            throw new InvalidOperationException("Cannot book for a show that has already started");
        }

        // 2. Get and validate seats belong to the show's screen
        List<Seat> seats = seatRepository.findByIdInAndScreenId(
            request.getSeatIds(), 
            show.getScreen().getId()
        );

        if (seats.size() != request.getSeatIds().size()) {
            throw new InvalidOperationException(
                "One or more selected seats do not belong to this show's screen"
            );
        }

        // 3. CRITICAL: Check if seats are available (not locked or confirmed)
        LocalDateTime now = LocalDateTime.now();
        boolean seatsUnavailable = bookingRepository.areSeatsUnavailable(
            request.getShowId(),
            request.getSeatIds(),
            now
        );

        if (seatsUnavailable) {
            // Get specific unavailable seats for error message
            Set<Long> lockedSeatIds = bookingRepository.findLockedSeatIdsForShow(
                request.getShowId(), now
            );
            Set<Long> confirmedSeatIds = bookingRepository.findConfirmedSeatIdsForShow(
                request.getShowId()
            );
            
            Set<Long> unavailableSeatIds = new HashSet<>();
            unavailableSeatIds.addAll(lockedSeatIds);
            unavailableSeatIds.addAll(confirmedSeatIds);
            unavailableSeatIds.retainAll(request.getSeatIds());
            
            throw new SeatAlreadyLockedException(
                "One or more selected seats are not available",
                unavailableSeatIds
            );
        }

        // 4. Calculate total amount
        Integer totalAmount = seats.stream()
            .mapToInt(seat -> show.getPriceForSeatType(seat.getType()))
            .sum();

        // 5. Create booking with lock expiry time
        LocalDateTime lockExpiryTime = now.plusMinutes(lockDurationMinutes);
        
        Booking booking = new Booking(
            userId,
            show,
            new HashSet<>(seats),
            lockExpiryTime,
            totalAmount
        );

        booking = bookingRepository.save(booking);
        logger.info("Booking created with ID: {}, lock expires at: {}", 
            booking.getId(), lockExpiryTime);

        return BookingSummaryResponse.fromEntity(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingSummaryResponse getBookingById(Long bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Check ownership
        if (!booking.getUserId().equals(userId)) {
            throw new AccessDeniedException("Booking", bookingId);
        }

        return BookingSummaryResponse.fromEntity(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingSummaryResponse> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId)
            .stream()
            .map(BookingSummaryResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicket(Long bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Check ownership
        if (!booking.getUserId().equals(userId)) {
            throw new AccessDeniedException("Booking", bookingId);
        }

        // Only return ticket if confirmed
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidOperationException(
                "Ticket is only available for confirmed bookings. Current status: " + booking.getStatus()
            );
        }

        return TicketResponse.fromBooking(booking);
    }

    @Override
    @Transactional
    public void confirmBooking(Long bookingId) {
        logger.info("Confirming booking: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != BookingStatus.INITIATED) {
            logger.warn("Booking {} is not in INITIATED status, current: {}", 
                bookingId, booking.getStatus());
            return;
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        logger.info("Booking {} confirmed", bookingId);
    }

    @Override
    @Transactional
    public void expireBooking(Long bookingId) {
        logger.info("Expiring booking: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != BookingStatus.INITIATED) {
            logger.warn("Booking {} is not in INITIATED status, current: {}", 
                bookingId, booking.getStatus());
            return;
        }

        booking.setStatus(BookingStatus.EXPIRED);
        bookingRepository.save(booking);
        logger.info("Booking {} expired, seats released", bookingId);
    }
}
