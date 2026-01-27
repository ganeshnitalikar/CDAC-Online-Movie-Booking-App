package com.cineverse.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateScreenRequest {

    @NotBlank
    private String name;

    @NotNull
    private Long theatreId;
}
