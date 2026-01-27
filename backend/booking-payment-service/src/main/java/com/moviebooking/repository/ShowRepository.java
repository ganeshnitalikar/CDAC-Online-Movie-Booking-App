package com.moviebooking.repository;

import com.moviebooking.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Show entity operations.
 */
@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {

    /**
     * Find all shows for a specific movie.
     */
    List<Show> findByMovieId(String movieId);

    /**
     * Find all shows in a screen.
     */
    List<Show> findByScreenId(Long screenId);

    /**
     * Find all shows for a movie in a specific city.
     */
    @Query("SELECT s FROM Show s WHERE s.movieId = :movieId " +
           "AND s.screen.theatre.city = :city " +
           "AND s.startTime > :currentTime " +
           "ORDER BY s.startTime")
    List<Show> findByMovieIdAndCity(@Param("movieId") String movieId, 
                                     @Param("city") String city,
                                     @Param("currentTime") LocalDateTime currentTime);

    /**
     * Check for overlapping shows in the same screen.
     * Used to prevent scheduling conflicts.
     */
    @Query("SELECT COUNT(s) > 0 FROM Show s WHERE s.screen.id = :screenId " +
           "AND ((s.startTime < :endTime AND s.endTime > :startTime))")
    boolean hasOverlappingShow(@Param("screenId") Long screenId,
                               @Param("startTime") LocalDateTime startTime,
                               @Param("endTime") LocalDateTime endTime);

    /**
     * Find upcoming shows for a theatre.
     */
    @Query("SELECT s FROM Show s WHERE s.screen.theatre.id = :theatreId " +
           "AND s.startTime > :currentTime ORDER BY s.startTime")
    List<Show> findUpcomingShowsByTheatreId(@Param("theatreId") Long theatreId,
                                             @Param("currentTime") LocalDateTime currentTime);
}
