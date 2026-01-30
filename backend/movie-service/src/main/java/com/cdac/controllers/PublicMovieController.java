package com.cdac.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cdac.dtos.response.MovieResponse;
import com.cdac.service.MovieService;

import java.util.List;

@RestController
@RequestMapping("/api/public/movies")
@RequiredArgsConstructor
public class PublicMovieController {

    private final MovieService movieService;
    
    /*
     * get all approved movies 
     */
    @GetMapping
    public ResponseEntity<List<MovieResponse>> getPublicMovies() {
        return ResponseEntity.ok(movieService.getPublicMovies());
    }

    /*
     * get movie by its id (movie details page)
     */
    @GetMapping("/{movieId}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable String movieId) {
        return ResponseEntity.ok(movieService.getMovieById(movieId));
    }
    
    /*
     * search movie 
     */
    
    @GetMapping("/search")
    public ResponseEntity<List<MovieResponse>> searchMovies(
            @RequestParam String query
    ) {
    	
        return ResponseEntity.ok(movieService.searchPublicMovies(query));
    }

   

}
