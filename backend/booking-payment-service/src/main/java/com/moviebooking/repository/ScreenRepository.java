package com.moviebooking.repository;

import com.moviebooking.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Screen entity operations.
 */
@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {

    /**
     * Find all screens in a theatre.
     */
    List<Screen> findByTheatreId(Long theatreId);

    /**
     * Check if a screen with given name exists in a theatre.
     */
    boolean existsByNameAndTheatreId(String name, Long theatreId);
}
