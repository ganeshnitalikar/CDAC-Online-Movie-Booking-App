package com.moviebooking.service.impl;

import com.moviebooking.dto.request.CreateTheatreRequest;
import com.moviebooking.dto.response.TheatreResponse;
import com.moviebooking.entity.Theatre;
import com.moviebooking.exception.InvalidOperationException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.TheatreRepository;
import com.moviebooking.service.TheatreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of TheatreService.
 */
@Service
public class TheatreServiceImpl implements TheatreService {

    private static final Logger logger = LoggerFactory.getLogger(TheatreServiceImpl.class);

    private final TheatreRepository theatreRepository;

    public TheatreServiceImpl(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    @Override
    @Transactional
    public TheatreResponse createTheatre(CreateTheatreRequest request) {
        logger.info("Creating theatre: {} in city: {}", request.getName(), request.getCity());

        // Check for duplicate theatre name in same city
        if (theatreRepository.existsByNameAndCity(request.getName(), request.getCity())) {
            throw new InvalidOperationException(
                "Theatre with name '" + request.getName() + "' already exists in " + request.getCity()
            );
        }

        Theatre theatre = new Theatre(
            request.getName(),
            request.getCity(),
            request.getOwnerId()
        );

        theatre = theatreRepository.save(theatre);
        logger.info("Theatre created with ID: {}", theatre.getId());

        return TheatreResponse.fromEntity(theatre);
    }

    @Override
    @Transactional(readOnly = true)
    public TheatreResponse getTheatreById(Long id) {
        Theatre theatre = theatreRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Theatre", "id", id));
        return TheatreResponse.fromEntity(theatre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TheatreResponse> getAllTheatres() {
        return theatreRepository.findAll()
            .stream()
            .map(TheatreResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TheatreResponse> getTheatresByCity(String city) {
        return theatreRepository.findByCity(city)
            .stream()
            .map(TheatreResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TheatreResponse> getTheatresByOwnerId(String ownerId) {
        return theatreRepository.findByOwnerId(ownerId)
            .stream()
            .map(TheatreResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTheatreOwner(Long theatreId, String userId) {
        Theatre theatre = theatreRepository.findById(theatreId)
            .orElseThrow(() -> new ResourceNotFoundException("Theatre", "id", theatreId));
        return theatre.getOwnerId().equals(userId);
    }
}
