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

    // List page
    @GetMapping
    public ResponseEntity<List<MovieResponse>> getPublicMovies() {
        return ResponseEntity.ok(movieService.getPublicMovies());
    }

    // Movie details page
    @GetMapping("/{movieId}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable String movieId) {
        return ResponseEntity.ok(movieService.getMovieById(movieId));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<MovieResponse>> searchMovies(
            @RequestParam String q
    ) {
    	System.out.println("hello");
    	
        return ResponseEntity.ok(movieService.searchPublicMovies(q));
    }

   

}
