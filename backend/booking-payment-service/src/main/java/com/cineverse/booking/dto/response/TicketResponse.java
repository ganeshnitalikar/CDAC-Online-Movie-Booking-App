package com.cineverse.booking.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class TicketResponse {

    private Long bookingId;
    private String movieId;
    private String theatreName;
    private String screenName;
    private Set<String> seats;
    private LocalDateTime showStartTime;
}
