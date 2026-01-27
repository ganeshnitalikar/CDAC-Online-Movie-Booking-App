package com.moviebooking.service.impl;

import com.moviebooking.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

/**
 * Scheduled task to clean up expired bookings.
 * 
 * This runs periodically to mark INITIATED bookings as EXPIRED
 * when their lock has expired, releasing the seats for others.
 * 
 * IMPORTANT: This is a backup mechanism. The primary check for
 * seat availability always happens at booking time.
 */
@Component
public class BookingExpiryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BookingExpiryScheduler.class);

    private final BookingRepository bookingRepository;

    public BookingExpiryScheduler(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * Run every minute to clean up expired bookings.
     * 
     * Uses bulk update for efficiency.
     */
    @Scheduled(fixedRate = 60000) // Every 1 minute
    @Transactional
    public void markExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        int expiredCount = bookingRepository.markExpiredBookings(now);
        
        if (expiredCount > 0) {
            logger.info("Marked {} expired bookings, seats released", expiredCount);
        }
    }
}
