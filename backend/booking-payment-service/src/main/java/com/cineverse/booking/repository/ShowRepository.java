package com.cineverse.booking.repository;

import com.cineverse.booking.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByScreenId(Long screenId);

    List<Show> findByScreenTheatreCityAndStartTimeAfter(
            String city,
            LocalDateTime startTime
    );
    
    boolean existsByScreenIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long screenId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    default boolean existsByScreenIdAndTimeOverlap(
            Long screenId,
            LocalDateTime start,
            LocalDateTime end
    ) {
        return existsByScreenIdAndStartTimeLessThanAndEndTimeGreaterThan(
                screenId,
                end,
                start
        );
    }
    
    List<Show> findByScreenTheatreOwnerId(String ownerId);
    List<Show> findByMovieIdAndStartTimeAfter(
            String movieId,
            LocalDateTime time
    );
}
