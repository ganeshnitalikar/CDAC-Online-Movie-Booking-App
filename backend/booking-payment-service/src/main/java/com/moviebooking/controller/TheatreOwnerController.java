package com.moviebooking.controller;

import com.moviebooking.config.JwtUserDetails;
import com.moviebooking.dto.request.CreateScreenRequest;
import com.moviebooking.dto.request.CreateShowRequest;
import com.moviebooking.dto.request.SeatLayoutRequest;
import com.moviebooking.dto.response.ScreenResponse;
import com.moviebooking.dto.response.SeatResponse;
import com.moviebooking.dto.response.ShowResponse;
import com.moviebooking.dto.response.TheatreResponse;
import com.moviebooking.service.ScreenService;
import com.moviebooking.service.ShowService;
import com.moviebooking.service.TheatreService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Controller for THEATRE_OWNER operations.
 * 
 * THEATRE_OWNER can:
 * - Manage ONLY their own theatres
 * - Create screens for their theatres
 * - Configure seat layouts
 * - Create shows
 */
@RestController
@RequestMapping("/api/owner")
public class TheatreOwnerController {

    private static final Logger logger = LoggerFactory.getLogger(TheatreOwnerController.class);

    private final TheatreService theatreService;
    private final ScreenService screenService;
    private final ShowService showService;
    private final JwtUserDetails jwtUserDetails;

    public TheatreOwnerController(TheatreService theatreService,
                                   ScreenService screenService,
                                   ShowService showService,
                                   JwtUserDetails jwtUserDetails) {
        this.theatreService = theatreService;
        this.screenService = screenService;
        this.showService = showService;
        this.jwtUserDetails = jwtUserDetails;
    }

    /**
     * Get all theatres owned by the current user.
     */
    @GetMapping("/theatres")
    public ResponseEntity<List<TheatreResponse>> getMyTheatres() {
        String userId = jwtUserDetails.getCurrentUserId();
        logger.info("Owner {} fetching their theatres", userId);
        
        List<TheatreResponse> theatres = theatreService.getTheatresByOwnerId(userId);
        return ResponseEntity.ok(theatres);
    }

    /**
     * Get a specific theatre by ID.
     * Ownership is validated in service layer.
     */
    @GetMapping("/theatres/{id}")
    public ResponseEntity<TheatreResponse> getTheatre(@PathVariable Long id) {
        TheatreResponse theatre = theatreService.getTheatreById(id);
        return ResponseEntity.ok(theatre);
    }

    /**
     * Create a screen in a theatre.
     * Only the theatre owner can create screens.
     */
    @PostMapping("/screens")
    public ResponseEntity<ScreenResponse> createScreen(
            @Valid @RequestBody CreateScreenRequest request) {
        
        String userId = jwtUserDetails.getCurrentUserId();
        logger.info("Owner {} creating screen in theatre {}", userId, request.getTheatreId());
        
        ScreenResponse response = screenService.createScreen(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all screens for a theatre.
     */
    @GetMapping("/theatres/{theatreId}/screens")
    public ResponseEntity<List<ScreenResponse>> getScreens(@PathVariable Long theatreId) {
        List<ScreenResponse> screens = screenService.getScreensByTheatreId(theatreId);
        return ResponseEntity.ok(screens);
    }

    /**
     * Configure seat layout for a screen.
     * Only the theatre owner can configure seats.
     */
    @PostMapping("/screens/seats")
    public ResponseEntity<List<SeatResponse>> configureSeatLayout(
            @Valid @RequestBody SeatLayoutRequest request) {
        
        String userId = jwtUserDetails.getCurrentUserId();
        logger.info("Owner {} configuring seats for screen {}", userId, request.getScreenId());
        
        List<SeatResponse> seats = screenService.configureSeatLayout(request, userId);
        return new ResponseEntity<>(seats, HttpStatus.CREATED);
    }

    /**
     * Get seats for a screen.
     */
    @GetMapping("/screens/{screenId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeats(@PathVariable Long screenId) {
        List<SeatResponse> seats = screenService.getSeatsByScreenId(screenId);
        return ResponseEntity.ok(seats);
    }

    /**
     * Create a show.
     * Only the theatre owner can create shows.
     */
    @PostMapping("/shows")
    public ResponseEntity<ShowResponse> createShow(
            @Valid @RequestBody CreateShowRequest request) {
        
        String userId = jwtUserDetails.getCurrentUserId();
        logger.info("Owner {} creating show for movie {} on screen {}", 
            userId, request.getMovieId(), request.getScreenId());
        
        ShowResponse response = showService.createShow(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all shows for a theatre.
     */
    @GetMapping("/theatres/{theatreId}/shows")
    public ResponseEntity<List<ShowResponse>> getShowsByTheatre(@PathVariable Long theatreId) {
        List<ShowResponse> shows = showService.getShowsByTheatreId(theatreId);
        return ResponseEntity.ok(shows);
    }
}
