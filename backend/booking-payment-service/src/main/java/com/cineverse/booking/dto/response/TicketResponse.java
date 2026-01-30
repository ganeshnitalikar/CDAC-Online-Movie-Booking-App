package com.cineverse.booking.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class TicketResponse {

    private Long bookingId;
    private String movieId;
    private String theatreName;
    private String screenName;
    private List<String> seats;
    private LocalDateTime showStartTime;
}
