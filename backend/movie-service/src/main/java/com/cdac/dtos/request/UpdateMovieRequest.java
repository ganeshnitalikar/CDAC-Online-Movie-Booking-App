package com.cdac.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMovieRequest {

    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    @Size(min = 3, max = 50, message = "Genre must be between 3 and 50 characters")
    private String genre;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;

    @PastOrPresent(message = "Release date cannot be in the future")
    private LocalDate releaseDate;

    /**
     * Only ADMIN can change active status
     */
    private Boolean active;
}
