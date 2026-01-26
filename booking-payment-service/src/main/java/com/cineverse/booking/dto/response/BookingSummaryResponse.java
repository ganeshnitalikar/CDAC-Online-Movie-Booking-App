package com.cineverse.booking.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class BookingSummaryResponse {

    private Long bookingId;
    private String showMovieId;
    private Set<String> seats;
    private String status;
    private LocalDateTime lockExpiryTime;
    private Integer amount;
}
