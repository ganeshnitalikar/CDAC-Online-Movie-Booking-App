package com.cineverse.booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RazorpayOrderRequest {

    @NotNull
    private Long bookingId;
}
