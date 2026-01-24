package com.cdac.entities;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "movies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
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

    private List<CastMember> cast;
    private List<CrewMember> crew;

    private String createdByUserId;
    private String createdByRole;

    private boolean approved;
    private boolean active;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
