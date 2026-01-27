package com.cineverse.booking.repository;

import com.cineverse.booking.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScreenRepository extends JpaRepository<Screen, Long> {

    List<Screen> findByTheatreId(Long theatreId);
    List<Screen> findByTheatreOwnerId(String ownerId);
    Optional<Screen> findByIdAndTheatreOwnerId(Long id, String ownerId);
}
