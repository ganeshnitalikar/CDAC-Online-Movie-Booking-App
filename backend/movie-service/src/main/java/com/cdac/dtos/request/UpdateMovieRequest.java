package com.cdac.dtos.request;

import com.cdac.entities.CastMember;
import com.cdac.entities.CrewMember;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateMovieRequest {

    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    private List<@NotBlank String> genre;

    private String posterUrl;
    private String backdropUrl;

    @DecimalMin(value = "0.0", message = "Rating cannot be negative")
    @DecimalMax(value = "10.0", message = "Rating cannot exceed 10")
    private Double rating;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;

    @PastOrPresent(message = "Release date cannot be in the future")
    private LocalDate releaseDate;

    private String language;
    private String certificate;

    private List<CastMember> cast;
    private List<CrewMember> crew;

    // ADMIN only (already enforced in service)
    private Boolean active;
}
