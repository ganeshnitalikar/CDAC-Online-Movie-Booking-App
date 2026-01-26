package com.cineverse.booking.scheduler;

import com.cineverse.booking.entity.Booking;
import com.cineverse.booking.entity.BookingStatus;
import com.cineverse.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingExpiryScheduler {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedDelay = 60000) // every 1 minute
    public void expireBookings() {

        List<Booking> expiredBookings =
                bookingRepository.findByStatusAndLockExpiryTimeBefore(
                        BookingStatus.INITIATED,
                        LocalDateTime.now()
                );

        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
        }
    }
}
