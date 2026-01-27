package com.cineverse.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTheatreRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String city;

}
