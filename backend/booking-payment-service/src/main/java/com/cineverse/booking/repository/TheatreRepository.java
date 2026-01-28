package com.cineverse.booking.repository;

import com.cineverse.booking.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TheatreRepository extends JpaRepository<Theatre, Long> {

    List<Theatre> findByOwnerId(String ownerId);
    Optional<Theatre> findByIdAndOwnerId(Long id, String ownerId);
    void deleteById(Long id);
}
