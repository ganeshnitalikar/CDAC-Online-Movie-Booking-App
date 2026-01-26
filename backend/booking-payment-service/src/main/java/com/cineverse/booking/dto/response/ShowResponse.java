package com.cineverse.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ShowResponse {

    private Long id;
    private String movieId;

    private Long screenId;
    private String screenName;

    private Long theatreId;
    private String theatreName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
