package com.moviebooking.repository;

import com.moviebooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Set;

/**
 * Repository for Seat entity operations.
 */
@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    /**
     * Find all seats for a screen.
     */
    List<Seat> findByScreenId(Long screenId);

    /**
     * Find seats by IDs for a specific screen.
     * Used to validate seat IDs belong to the correct screen.
     */
    @Query("SELECT s FROM Seat s WHERE s.id IN :seatIds AND s.screen.id = :screenId")
    List<Seat> findByIdInAndScreenId(@Param("seatIds") Set<Long> seatIds, 
                                      @Param("screenId") Long screenId);

    /**
     * Find all seats in a screen ordered by row and seat label.
     */
    @Query("SELECT s FROM Seat s WHERE s.screen.id = :screenId ORDER BY s.rowLabel, s.seatLabel")
    List<Seat> findByScreenIdOrdered(@Param("screenId") Long screenId);
}
