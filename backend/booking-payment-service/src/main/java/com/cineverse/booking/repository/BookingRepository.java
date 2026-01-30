package com.cineverse.booking.repository;

import com.cineverse.booking.entity.Booking;
import com.cineverse.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        select b from Booking b
        join b.seats s
        where b.show.id = :showId
          and s.id in :seatIds
          and b.status = 'INITIATED'
          and b.lockExpiryTime > :now
    """)
    List<Booking> findActiveSeatLocks(
            Long showId,
            Set<Long> seatIds,
            LocalDateTime now
    );
    
    @Query("""
    	    select distinct b from Booking b
    	    join fetch b.seats s
    	    where b.show.id = :showId
    	      and (
    	           b.status = 'CONFIRMED'
    	        or (b.status = 'INITIATED' and b.lockExpiryTime > :now)
    	      )
    	""")
    	List<Booking> findActiveBookingsWithSeats(
    	        Long showId,
    	        LocalDateTime now
    	);

    @Query("""
    	    select b from Booking b
    	    join b.seats s
    	    where b.show.id = :showId
    	      and s.id in :seatIds
    	      and b.status = 'CONFIRMED'
    	""")
    	List<Booking> findConfirmedSeatBookings(
    	        Long showId,
    	        Set<Long> seatIds
    	);

    
    List<Booking> findByStatusAndLockExpiryTimeBefore(
            BookingStatus status,
            LocalDateTime time
    );

    List<Booking> findByUserId(String userId);
    
    List<Booking> findByUserIdOrderByIdDesc(String userId);

}
