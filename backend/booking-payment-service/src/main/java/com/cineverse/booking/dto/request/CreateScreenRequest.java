package com.cineverse.booking.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateScreenRequest {

    @NotBlank
    private String name;
    
    @NotNull
    private int capacity;
    
    private List<String> features;

    @NotNull
    private Long theatreId;
}
