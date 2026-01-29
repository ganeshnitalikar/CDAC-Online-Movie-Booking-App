package com.cdac.service;

import com.cdac.dtos.request.AdminApprovalRequest;
import com.cdac.dtos.request.CreateMovieRequest;
import com.cdac.dtos.request.UpdateMovieRequest;
import com.cdac.dtos.response.CastResponse;
import com.cdac.dtos.response.CrewResponse;
import com.cdac.dtos.response.MovieResponse;
import com.cdac.entities.Movie;
import com.cdac.exception.AccessDeniedException;
import com.cdac.exception.InvalidOperationException;
import com.cdac.exception.MovieNotFoundException;
import com.cdac.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    // =========================
    // Public / USER
    // =========================

    @Override
    public List<MovieResponse> getPublicMovies() {
        return movieRepository.findByApprovedTrueAndActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MovieResponse> getOwnerMovies(String ownerId){
    	return movieRepository.findByCreatedByUserId(ownerId);
    }

    @Override
    public MovieResponse getMovieById(String movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException("Movie not found with id: " + movieId));

        if (!movie.isApproved() || !movie.isActive()) {
            throw new MovieNotFoundException("Movie not available");
        }

        return toResponse(movie);
    }

    // =========================
    // Create Movie
    // =========================

    @Override
    public MovieResponse createMovie(CreateMovieRequest request, String userId, String role) {

        if (!role.equals("ADMIN") && !role.equals("THEATER_OWNER")) {
            throw new AccessDeniedException("You are not allowed to add movies");
        }

        boolean approvedByDefault = role.equals("ADMIN");

        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .posterUrl(request.getPosterUrl())
                .backdropUrl(request.getBackdropUrl())
                .rating(request.getRating())
                .language(request.getLanguage())
                .certificate(request.getCertificate())
                .cast(request.getCast())
                .crew(request.getCrew())
                .durationMinutes(request.getDurationMinutes())
                .releaseDate(request.getReleaseDate())
                .createdByUserId(userId)
                .createdByRole(role)
                .approved(approvedByDefault)
                .active(true)
                .build();

        Movie savedMovie = movieRepository.save(movie);
        return toResponse(savedMovie);
    }

    // =========================
    // Update Movie
    // =========================

    @Override
    public MovieResponse updateMovie(
            String movieId,
            UpdateMovieRequest request,
            String userId,
            String role
    ) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found"));

        if (role.equals("THEATER_OWNER")) {
            if (!movie.getCreatedByUserId().equals(userId)) {
                throw new AccessDeniedException("You can update only your own movies");
            }
        } else if (!role.equals("ADMIN")) {
            throw new AccessDeniedException("You are not allowed to update movies");
        }

        if (request.getTitle() != null) movie.setTitle(request.getTitle());
        if (request.getDescription() != null) movie.setDescription(request.getDescription());
        if (request.getGenre() != null) movie.setGenre(request.getGenre());
        if (request.getPosterUrl() != null) movie.setPosterUrl(request.getPosterUrl());
        if (request.getBackdropUrl() != null) movie.setBackdropUrl(request.getBackdropUrl());
        if (request.getRating() != null) movie.setRating(request.getRating());
        if (request.getLanguage() != null) movie.setLanguage(request.getLanguage());
        if (request.getCertificate() != null) movie.setCertificate(request.getCertificate());
        if (request.getCast() != null) movie.setCast(request.getCast());
        if (request.getCrew() != null) movie.setCrew(request.getCrew());
        if (request.getDurationMinutes() != null) movie.setDurationMinutes(request.getDurationMinutes());
        if (request.getReleaseDate() != null) movie.setReleaseDate(request.getReleaseDate());

        if (request.getActive() != null) {
            if (!role.equals("ADMIN")) {
                throw new AccessDeniedException("Only admin can change active status");
            }
            movie.setActive(request.getActive());
        }

        Movie updatedMovie = movieRepository.save(movie);
        return toResponse(updatedMovie);
    }

    // =========================
    // Delete Movie
    // =========================

    @Override
    public void deleteMovie(String movieId, String userId, String role) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found"));

        if (role.equals("THEATER_OWNER")) {
            if (!movie.getCreatedByUserId().equals(userId)) {
                throw new AccessDeniedException("You can delete only your own movies");
            }
        } else if (!role.equals("ADMIN")) {
            throw new AccessDeniedException("You are not allowed to delete movies");
        }

        movieRepository.delete(movie);
    }

    // =========================
    // Admin Approval
    // =========================

    @Override
    public MovieResponse approveMovie(
            String movieId,
            AdminApprovalRequest request,
            String adminUserId
    ) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found"));

        if (movie.isApproved() && request.getApproved()) {
            throw new InvalidOperationException("Movie is already approved");
        }

        movie.setApproved(request.getApproved());

        Movie savedMovie = movieRepository.save(movie);
        return toResponse(savedMovie);
    }

    @Override
    public List<MovieResponse> getPendingApprovalMovies() {
        return movieRepository.findByApprovedFalse()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =========================
    // Mapping Helper
    // =========================

    private MovieResponse toResponse(Movie movie) {

        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .posterUrl(movie.getPosterUrl())
                .backdropUrl(movie.getBackdropUrl())
                .rating(movie.getRating())
                .durationMinutes(movie.getDurationMinutes())
                .releaseDate(movie.getReleaseDate())
                .language(movie.getLanguage())
                .certificate(movie.getCertificate())
                .cast(
                        movie.getCast() == null ? List.of() :
                                movie.getCast().stream()
                                        .map(c -> CastResponse.builder()
                                                .id(c.getId())
                                                .name(c.getName())
                                                .role(c.getRole())
                                                .build())
                                        .collect(Collectors.toList())
                )
                .crew(
                        movie.getCrew() == null ? List.of() :
                                movie.getCrew().stream()
                                        .map(c -> CrewResponse.builder()
                                                .id(c.getId())
                                                .name(c.getName())
                                                .role(c.getRole())
                                                .build())
                                        .collect(Collectors.toList())
                )
                .approved(movie.isApproved())
                .active(movie.isActive())
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }
    @Override
    public List<MovieResponse> searchPublicMovies(String keyword) {
 
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        return movieRepository.searchMovies(keyword)
                .stream()
                .map(this::toResponse)
                .toList();
    }


}
