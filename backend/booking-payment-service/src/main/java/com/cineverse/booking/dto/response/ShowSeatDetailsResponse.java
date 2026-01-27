package com.cineverse.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ShowSeatDetailsResponse {

    private Long showId;
    private String movieId;

    private Long theatreId;
    private String theatreName;

    private Long screenId;
    private String screenName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
