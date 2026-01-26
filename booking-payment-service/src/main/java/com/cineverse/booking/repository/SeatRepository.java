package com.cineverse.booking.repository;

import com.cineverse.booking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByScreenId(Long screenId);

    Set<Seat> findByIdIn(Set<Long> ids);
}
