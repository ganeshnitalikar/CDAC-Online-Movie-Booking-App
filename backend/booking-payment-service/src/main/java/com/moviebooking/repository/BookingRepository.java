package com.moviebooking.repository;

import com.moviebooking.entity.Booking;
import com.moviebooking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Repository for Booking entity operations.
 * Contains critical queries for seat locking and expiry handling.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Find all bookings for a user.
     */
    List<Booking> findByUserId(String userId);

    /**
     * Find all bookings for a user with a specific status.
     */
    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);

    /**
     * Find booking by ID and user ID (for ownership validation).
     */
    Optional<Booking> findByIdAndUserId(Long id, String viserId);

    /**
     * CRITICAL: Find locked seats for a show.
     * A seat is locked if:
     * - It's in an INITIATED booking
     * - The lock hasn't expired yet
     * 
     * This is the core of the seat locking mechanism.
     */
    @Query("SELECT DISTINCT s.id FROM Booking b JOIN b.seats s " +
           "WHERE b.show.id = :showId " +
           "AND b.status = 'INITIATED' " +
           "AND b.lockExpiryTime > :currentTime")
    Set<Long> findLockedSeatIdsForShow(@Param("showId") Long showId,
                                        @Param("currentTime") LocalDateTime currentTime);

    /**
     * CRITICAL: Find confirmed seats for a show.
     * Confirmed bookings permanently occupy seats.
     */
    @Query("SELECT DISTINCT s.id FROM Booking b JOIN b.seats s " +
           "WHERE b.show.id = :showId " +
           "AND b.status = 'CONFIRMED'")
    Set<Long> findConfirmedSeatIdsForShow(@Param("showId") Long showId);

    /**
     * Find all expired bookings that need cleanup.
     * These are INITIATED bookings whose lock has expired.
     */
    @Query("SELECT b FROM Booking b WHERE b.status = 'INITIATED' " +
           "AND b.lockExpiryTime < :currentTime")
    List<Booking> findExpiredBookings(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Bulk update expired bookings to EXPIRED status.
     * More efficient than updating one by one.
     */
    @Modifying
    @Query("UPDATE Booking b SET b.status = 'EXPIRED' " +
           "WHERE b.status = 'INITIATED' " +
           "AND b.lockExpiryTime < :currentTime")
    int markExpiredBookings(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Check if any of the given seats are locked for a show.
     * Used before creating a new booking to check availability.
     */
    @Query("SELECT COUNT(b) > 0 FROM Booking b JOIN b.seats s " +
           "WHERE b.show.id = :showId " +
           "AND s.id IN :seatIds " +
           "AND ((b.status = 'INITIATED' AND b.lockExpiryTime > :currentTime) " +
           "OR b.status = 'CONFIRMED')")
    boolean areSeatsUnavailable(@Param("showId") Long showId,
                                 @Param("seatIds") Set<Long> seatIds,
                                 @Param("currentTime") LocalDateTime currentTime);
}
