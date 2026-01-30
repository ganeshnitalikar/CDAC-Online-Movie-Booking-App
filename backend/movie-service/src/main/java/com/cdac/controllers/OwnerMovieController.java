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
    
    
    /*
     * get all movies 
     */
    
    @GetMapping
    public ResponseEntity<?> getMovies(
    		@Valid @RequestBody CreateMovieRequest request
    		) {
    	return ResponseEntity.ok( 
<<<<<<< Updated upstream
    			 movieService.getPublicMovies());
=======
<<<<<<< Updated upstream
    			 movieService.getOwnerMovies(
    					 jwt.getSubject()
    					 ));
>>>>>>> Stashed changes
    			
=======
    			 movieService.getPublicMovies());			
>>>>>>> Stashed changes
    }
    
    /*
     * create a new movie
     * ROLE - THEATER_OWNER
     */

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
    /*
     * update a existing movie that is added by same owner
     * ROLE - THEATER_OWNER
     */

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
    
    /*
     * theater owner can delete his movies
     */

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
