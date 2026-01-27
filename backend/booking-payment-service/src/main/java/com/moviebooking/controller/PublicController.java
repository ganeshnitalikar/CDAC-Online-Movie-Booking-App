package com.moviebooking.controller;

import com.moviebooking.dto.response.ShowResponse;
import com.moviebooking.dto.response.ShowSeatAvailabilityResponse;
import com.moviebooking.dto.response.TheatreResponse;
import com.moviebooking.service.ShowService;
import com.moviebooking.service.TheatreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Controller for public (unauthenticated) endpoints.
 * 
 * Anyone can:
 * - View theatres by city
 * - View shows by movie and city
 * - View seat availability for a show
 */
@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final TheatreService theatreService;
    private final ShowService showService;

    public PublicController(TheatreService theatreService, ShowService showService) {
        this.theatreService = theatreService;
        this.showService = showService;
    }

    /**
     * Get all theatres in a city.
     */
    @GetMapping("/theatres")
    public ResponseEntity<List<TheatreResponse>> getTheatresByCity(
            @RequestParam String city) {
        
        List<TheatreResponse> theatres = theatreService.getTheatresByCity(city);
        return ResponseEntity.ok(theatres);
    }

    /**
     * Get shows for a movie in a city.
     */
    @GetMapping("/shows")
    public ResponseEntity<List<ShowResponse>> getShows(
            @RequestParam String movieId,
            @RequestParam String city) {
        
        List<ShowResponse> shows = showService.getShowsByMovieAndCity(movieId, city);
        return ResponseEntity.ok(shows);
    }

    /**
     * Get show details.
     */
    @GetMapping("/shows/{showId}")
    public ResponseEntity<ShowResponse> getShow(@PathVariable Long showId) {
        ShowResponse show = showService.getShowById(showId);
        return ResponseEntity.ok(show);
    }

    /**
     * Get seat availability for a show.
     */
    @GetMapping("/shows/{showId}/seats")
    public ResponseEntity<ShowSeatAvailabilityResponse> getSeatAvailability(
            @PathVariable Long showId) {
        
        ShowSeatAvailabilityResponse response = showService.getShowSeatAvailability(showId);
        return ResponseEntity.ok(response);
    }
}
