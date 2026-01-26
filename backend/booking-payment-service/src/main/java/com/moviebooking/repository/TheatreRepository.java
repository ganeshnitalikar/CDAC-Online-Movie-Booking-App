package com.moviebooking.repository;

import com.moviebooking.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Theatre entity operations.
 */
@Repository
public interface TheatreRepository extends JpaRepository<Theatre, Long> {

    /**
     * Find all theatres by city name.
     */
    List<Theatre> findByCity(String city);

    /**
     * Find all theatres owned by a specific owner.
     */
    List<Theatre> findByOwnerId(String ownerId);

    /**
     * Check if a theatre with given name exists in a city.
     */
    boolean existsByNameAndCity(String name, String city);
}
