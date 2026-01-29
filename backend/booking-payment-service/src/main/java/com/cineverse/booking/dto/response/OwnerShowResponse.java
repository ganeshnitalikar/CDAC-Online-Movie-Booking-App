package com.cineverse.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class OwnerShowResponse {

    private Long showId;
    private String movieId;

    private Long screenId;
    private String screenName;

    private Long theatreId;
    private String theatreName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
