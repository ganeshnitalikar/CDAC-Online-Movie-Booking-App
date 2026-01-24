package com.cdac.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cdac.dtos.request.AdminApprovalRequest;
import com.cdac.dtos.request.CreateMovieRequest;
import com.cdac.dtos.request.UpdateMovieRequest;
import com.cdac.dtos.response.MovieResponse;
import com.cdac.entities.Movie;
import com.cdac.exception.AccessDeniedException;
import com.cdac.exception.InvalidOperationException;
import com.cdac.exception.MovieNotFoundException;
import com.cdac.repository.MovieRepository;

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
                .durationMinutes(request.getDurationMinutes())
                .releaseDate(request.getReleaseDate())
                .createdByUserId(userId)
                .createdByRole(role)
                .approved(approvedByDefault)
                .active(true)
                .build();

        Movie savedMovie = movieRepository.save(movie);
        System.out.println("Saved movie ID = " + savedMovie.getId());
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

        // Ownership / Role check
        if (role.equals("THEATER_OWNER")) {
            if (!movie.getCreatedByUserId().equals(userId)) {
                throw new AccessDeniedException("You can update only your own movies");
            }
        } else if (!role.equals("ADMIN")) {
            throw new AccessDeniedException("You are not allowed to update movies");
        }

        // Apply updates only if provided
        if (request.getTitle() != null) {
            movie.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            movie.setDescription(request.getDescription());
        }
        if (request.getGenre() != null) {
            movie.setGenre(request.getGenre());
        }
        if (request.getDurationMinutes() != null) {
            movie.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getReleaseDate() != null) {
            movie.setReleaseDate(request.getReleaseDate());
        }

        // Only ADMIN can change active flag
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
                .durationMinutes(movie.getDurationMinutes())
                .releaseDate(movie.getReleaseDate())
                .approved(movie.isApproved())
                .active(movie.isActive())
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }
}
