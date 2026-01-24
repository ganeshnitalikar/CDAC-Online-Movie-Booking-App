package com.cdac.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dtos.response.MovieResponse;
import com.cdac.service.MovieService;

import java.util.List;

@RestController
@RequestMapping("/api/public/movies")
@RequiredArgsConstructor
public class PublicMovieController {

    private final MovieService movieService;
    
    @GetMapping("/test")
    public ResponseEntity<String> test(){
    	return ResponseEntity.ok("Success");
    }

    @GetMapping
    public List<MovieResponse> getPublicMovies() {
        return movieService.getPublicMovies();
    }
}
