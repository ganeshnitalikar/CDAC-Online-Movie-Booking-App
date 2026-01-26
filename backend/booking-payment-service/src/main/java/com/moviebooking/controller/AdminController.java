package com.moviebooking.controller;

import com.moviebooking.dto.request.CreateTheatreRequest;
import com.moviebooking.dto.response.TheatreResponse;
import com.moviebooking.service.TheatreService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Controller for ADMIN operations.
 * 
 * ADMIN can:
 * - Onboard new theatres
 * - Manage all theatres and shows
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final TheatreService theatreService;

    public AdminController(TheatreService theatreService) {
        this.theatreService = theatreService;
    }

    /**
     * Create a new theatre (onboard).
     * Only ADMIN can create theatres.
     */
    @PostMapping("/theatres")
    public ResponseEntity<TheatreResponse> createTheatre(
            @Valid @RequestBody CreateTheatreRequest request) {
        
        logger.info("Admin creating theatre: {}", request.getName());
        TheatreResponse response = theatreService.createTheatre(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all theatres.
     */
    @GetMapping("/theatres")
    public ResponseEntity<List<TheatreResponse>> getAllTheatres() {
        List<TheatreResponse> theatres = theatreService.getAllTheatres();
        return ResponseEntity.ok(theatres);
    }

    /**
     * Get theatres by city.
     */
    @GetMapping("/theatres/by-city")
    public ResponseEntity<List<TheatreResponse>> getTheatresByCity(
            @RequestParam String city) {
        
        List<TheatreResponse> theatres = theatreService.getTheatresByCity(city);
        return ResponseEntity.ok(theatres);
    }

    /**
     * Get theatres by owner.
     */
    @GetMapping("/theatres/by-owner")
    public ResponseEntity<List<TheatreResponse>> getTheatresByOwner(
            @RequestParam String ownerId) {
        
        List<TheatreResponse> theatres = theatreService.getTheatresByOwnerId(ownerId);
        return ResponseEntity.ok(theatres);
    }
}
