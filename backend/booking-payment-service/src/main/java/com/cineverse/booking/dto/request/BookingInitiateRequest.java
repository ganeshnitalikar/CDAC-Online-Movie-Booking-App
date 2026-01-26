package com.cineverse.booking.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class BookingInitiateRequest {

    @NotNull
    private Long showId;

    @NotEmpty
    private Set<Long> seatIds;
}
