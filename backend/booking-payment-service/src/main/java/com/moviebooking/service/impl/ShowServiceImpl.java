package com.moviebooking.service.impl;

import com.moviebooking.dto.request.CreateShowRequest;
import com.moviebooking.dto.response.SeatResponse;
import com.moviebooking.dto.response.ShowResponse;
import com.moviebooking.dto.response.ShowSeatAvailabilityResponse;
import com.moviebooking.entity.Screen;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.exception.AccessDeniedException;
import com.moviebooking.exception.InvalidOperationException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.ScreenRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.service.ShowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of ShowService.
 */
@Service
public class ShowServiceImpl implements ShowService {

    private static final Logger logger = LoggerFactory.getLogger(ShowServiceImpl.class);

    private final ShowRepository showRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    public ShowServiceImpl(ShowRepository showRepository,
                           ScreenRepository screenRepository,
                           SeatRepository seatRepository,
                           BookingRepository bookingRepository) {
        this.showRepository = showRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional
    public ShowResponse createShow(CreateShowRequest request, String userId) {
        logger.info("Creating show for movie: {} at screen: {}", 
            request.getMovieId(), request.getScreenId());

        Screen screen = screenRepository.findById(request.getScreenId())
            .orElseThrow(() -> new ResourceNotFoundException("Screen", "id", request.getScreenId()));

        // Check ownership
        if (!screen.getTheatre().getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Screen", request.getScreenId());
        }

        // Validate times
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new InvalidOperationException("End time must be after start time");
        }

        // Check for overlapping shows
        if (showRepository.hasOverlappingShow(request.getScreenId(), 
                                              request.getStartTime(), 
                                              request.getEndTime())) {
            throw new InvalidOperationException(
                "Another show is scheduled during this time slot on this screen"
            );
        }

        Show show = new Show(
            request.getMovieId(),
            screen,
            request.getStartTime(),
            request.getEndTime(),
            request.getNormalSeatPrice(),
            request.getPremiumSeatPrice()
        );

        show = showRepository.save(show);
        logger.info("Show created with ID: {}", show.getId());

        return ShowResponse.fromEntity(show);
    }

    @Override
    @Transactional(readOnly = true)
    public ShowResponse getShowById(Long id) {
        Show show = showRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Show", "id", id));
        return ShowResponse.fromEntity(show);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowResponse> getShowsByMovieAndCity(String movieId, String city) {
        return showRepository.findByMovieIdAndCity(movieId, city, LocalDateTime.now())
            .stream()
            .map(ShowResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowResponse> getShowsByTheatreId(Long theatreId) {
        return showRepository.findUpcomingShowsByTheatreId(theatreId, LocalDateTime.now())
            .stream()
            .map(ShowResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ShowSeatAvailabilityResponse getShowSeatAvailability(Long showId) {
        Show show = showRepository.findById(showId)
            .orElseThrow(() -> new ResourceNotFoundException("Show", "id", showId));

        // Get all seats for the screen
        List<Seat> allSeats = seatRepository.findByScreenIdOrdered(show.getScreen().getId());

        // Get unavailable seat IDs (locked + confirmed)
        LocalDateTime now = LocalDateTime.now();
        Set<Long> lockedSeatIds = bookingRepository.findLockedSeatIdsForShow(showId, now);
        Set<Long> confirmedSeatIds = bookingRepository.findConfirmedSeatIdsForShow(showId);

        // Mark seat availability
        List<SeatResponse> seatResponses = allSeats.stream()
            .map(seat -> {
                boolean isAvailable = !lockedSeatIds.contains(seat.getId()) 
                                   && !confirmedSeatIds.contains(seat.getId());
                return SeatResponse.fromEntity(seat, isAvailable);
            })
            .collect(Collectors.toList());

        // Group by row
        Map<String, List<SeatResponse>> seatsByRow = seatResponses.stream()
            .collect(Collectors.groupingBy(
                SeatResponse::getRowLabel,
                LinkedHashMap::new,
                Collectors.toList()
            ));

        // Calculate counts
        int totalSeats = allSeats.size();
        int availableSeats = (int) seatResponses.stream()
            .filter(SeatResponse::isAvailable)
            .count();

        // Build response
        ShowSeatAvailabilityResponse response = new ShowSeatAvailabilityResponse();
        response.setShowId(showId);
        response.setMovieId(show.getMovieId());
        response.setTheatreName(show.getScreen().getTheatre().getName());
        response.setScreenName(show.getScreen().getName());
        response.setNormalSeatPrice(show.getNormalSeatPrice());
        response.setPremiumSeatPrice(show.getPremiumSeatPrice());
        response.setSeatsByRow(seatsByRow);
        response.setTotalSeats(totalSeats);
        response.setAvailableSeats(availableSeats);

        return response;
    }
}
