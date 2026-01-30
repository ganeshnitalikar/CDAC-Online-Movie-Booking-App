package com.cdac.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.cdac.dtos.request.AdminApprovalRequest;
import com.cdac.dtos.response.MovieResponse;
import com.cdac.service.MovieService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/movies")
@RequiredArgsConstructor
public class AdminMovieController {

    private final MovieService movieService;

    /*
     * gets all pending movie 
     * ROLE - ADMIN
     */
    @GetMapping("/pending")
    public List<MovieResponse> getPendingMovies() {
        return movieService.getPendingApprovalMovies();
    }
    
    /*
     * admin approves the pending movie 
     * ROLE - ADMIN
     */

    @PutMapping("/{movieId}/approval")
    public MovieResponse approveMovie(
            @PathVariable String movieId,
            @Valid @RequestBody AdminApprovalRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return movieService.approveMovie(
                movieId,
                request,
                jwt.getSubject()
        );
    }
}

