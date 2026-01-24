package com.cdac.dtos.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MovieResponse {

    private String id;
    private String title;
    private String description;

    private List<String> genre;

    private String posterUrl;
    private String backdropUrl;

    private Double rating;

    private Integer durationMinutes;
    private LocalDate releaseDate;

    private String language;
    private String certificate;

    private List<CastResponse> cast;
    private List<CrewResponse> crew;

    private boolean active;
    private boolean approved;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
