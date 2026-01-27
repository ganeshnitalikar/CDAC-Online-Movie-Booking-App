package com.moviebooking.service.impl;

import com.moviebooking.dto.request.CreateScreenRequest;
import com.moviebooking.dto.request.SeatLayoutRequest;
import com.moviebooking.dto.response.ScreenResponse;
import com.moviebooking.dto.response.SeatResponse;
import com.moviebooking.entity.Screen;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Theatre;
import com.moviebooking.exception.AccessDeniedException;
import com.moviebooking.exception.InvalidOperationException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.ScreenRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.TheatreRepository;
import com.moviebooking.service.ScreenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ScreenService.
 */
@Service
public class ScreenServiceImpl implements ScreenService {

    private static final Logger logger = LoggerFactory.getLogger(ScreenServiceImpl.class);

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;
    private final SeatRepository seatRepository;

    public ScreenServiceImpl(ScreenRepository screenRepository,
                             TheatreRepository theatreRepository,
                             SeatRepository seatRepository) {
        this.screenRepository = screenRepository;
        this.theatreRepository = theatreRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    @Transactional
    public ScreenResponse createScreen(CreateScreenRequest request, String userId) {
        logger.info("Creating screen: {} for theatre: {}", request.getName(), request.getTheatreId());

        Theatre theatre = theatreRepository.findById(request.getTheatreId())
            .orElseThrow(() -> new ResourceNotFoundException("Theatre", "id", request.getTheatreId()));

        // Check ownership
        if (!theatre.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Theatre", request.getTheatreId());
        }

        // Check for duplicate screen name in theatre
        if (screenRepository.existsByNameAndTheatreId(request.getName(), request.getTheatreId())) {
            throw new InvalidOperationException(
                "Screen with name '" + request.getName() + "' already exists in this theatre"
            );
        }

        Screen screen = new Screen(request.getName(), theatre);
        screen = screenRepository.save(screen);
        logger.info("Screen created with ID: {}", screen.getId());

        return ScreenResponse.fromEntity(screen);
    }

    @Override
    @Transactional(readOnly = true)
    public ScreenResponse getScreenById(Long id) {
        Screen screen = screenRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Screen", "id", id));
        return ScreenResponse.fromEntity(screen);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScreenResponse> getScreensByTheatreId(Long theatreId) {
        // Verify theatre exists
        if (!theatreRepository.existsById(theatreId)) {
            throw new ResourceNotFoundException("Theatre", "id", theatreId);
        }

        return screenRepository.findByTheatreId(theatreId)
            .stream()
            .map(ScreenResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<SeatResponse> configureSeatLayout(SeatLayoutRequest request, String userId) {
        logger.info("Configuring seat layout for screen: {}", request.getScreenId());

        Screen screen = screenRepository.findById(request.getScreenId())
            .orElseThrow(() -> new ResourceNotFoundException("Screen", "id", request.getScreenId()));

        // Check ownership
        if (!screen.getTheatre().getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Screen", request.getScreenId());
        }

        // Check if screen already has seats
        List<Seat> existingSeats = seatRepository.findByScreenId(request.getScreenId());
        if (!existingSeats.isEmpty()) {
            throw new InvalidOperationException("Screen already has seats configured. Cannot reconfigure.");
        }

        // Create seats
        List<Seat> seats = new ArrayList<>();
        for (SeatLayoutRequest.SeatRowRequest row : request.getRows()) {
            for (int i = 1; i <= row.getNumberOfSeats(); i++) {
                Seat seat = new Seat(
                    String.valueOf(i),
                    row.getRowLabel(),
                    row.getSeatType(),
                    screen
                );
                seats.add(seat);
            }
        }

        seats = seatRepository.saveAll(seats);
        logger.info("Created {} seats for screen {}", seats.size(), request.getScreenId());

        return seats.stream()
            .map(seat -> SeatResponse.fromEntity(seat, true))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByScreenId(Long screenId) {
        // Verify screen exists
        if (!screenRepository.existsById(screenId)) {
            throw new ResourceNotFoundException("Screen", "id", screenId);
        }

        return seatRepository.findByScreenIdOrdered(screenId)
            .stream()
            .map(seat -> SeatResponse.fromEntity(seat, true))
            .collect(Collectors.toList());
    }
}
