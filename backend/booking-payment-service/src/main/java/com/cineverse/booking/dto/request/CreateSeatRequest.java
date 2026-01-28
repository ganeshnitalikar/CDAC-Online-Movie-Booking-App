package com.cineverse.booking.dto.request;

import java.util.List;

import com.cineverse.booking.dto.request.CreateSeatRequest.SeatInput;
import com.cineverse.booking.entity.SeatType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class CreateSeatRequest {

    @NotNull
    private Long screenId;

    @NotEmpty
    private List<SeatInput> seats;

    @Getter
    @Setter
    public static class SeatInput {

        @NotBlank
        private String rowLabel;

        @NotBlank
        private String seatNumber;   

        @NotBlank
        private String seatLabel;

        @NotNull
        private SeatType type;
    }
}