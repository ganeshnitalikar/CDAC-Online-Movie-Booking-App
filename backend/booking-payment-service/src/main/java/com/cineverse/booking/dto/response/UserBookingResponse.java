package com.cineverse.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class UserBookingResponse {

    private Long bookingId;
    private String movieId;

    private String theatreName;
    private String screenName;

    private LocalDateTime showStartTime;
    private LocalDateTime showEndTime;

    private List<String> seats;

    private String status;
    private int amountPaid; // paise
}
