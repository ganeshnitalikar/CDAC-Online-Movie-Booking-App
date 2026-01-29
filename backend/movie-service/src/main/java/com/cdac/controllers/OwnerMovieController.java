package com.cdac.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.cdac.dtos.request.CreateMovieRequest;
import com.cdac.dtos.request.UpdateMovieRequest;
import com.cdac.dtos.response.MovieResponse;
import com.cdac.service.MovieService;

@RestController
@RequestMapping("/api/owner/movies")
@RequiredArgsConstructor
public class OwnerMovieController {

    private final MovieService movieService;
    
    @GetMapping
    public ResponseEntity<?> getMovies(
    		@AuthenticationPrincipal Jwt jwt
    		) {
    	return ResponseEntity.ok( 
    			 movieService.getOwnerMovies(
    					 jwt.getSubject()
    					 ));
    			
    }

    @PostMapping
    public MovieResponse createMovie(
            @Valid @RequestBody CreateMovieRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return movieService.createMovie(
                request,
                jwt.getSubject(),
                jwt.getClaim("role")
        );
    }

    @PutMapping("/{movieId}")
    public MovieResponse updateMovie(
            @PathVariable String movieId,
            @Valid @RequestBody UpdateMovieRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return movieService.updateMovie(
                movieId,
                request,
                jwt.getSubject(),
                jwt.getClaim("role")
        );
    }

    @DeleteMapping("/{movieId}")
    public void deleteMovie(
            @PathVariable String movieId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        movieService.deleteMovie(
                movieId,
                jwt.getSubject(),
                jwt.getClaim("role")
        );
    }
}
