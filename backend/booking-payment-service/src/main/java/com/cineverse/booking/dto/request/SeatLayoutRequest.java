package com.cineverse.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatLayoutRequest {

    @NotBlank
    private String rowLabel;

    @NotBlank
    private String seatLabel;

    @NotNull
    private String type; // NORMAL / PREMIUM
}
