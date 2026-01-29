package com.cineverse.booking.dto.request;

import com.cineverse.booking.entity.SeatType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatDto {
    @NotBlank
    private String rowLabel;

    @NotBlank
    private String seatLabel;

    @NotNull
    private SeatType type;
}
