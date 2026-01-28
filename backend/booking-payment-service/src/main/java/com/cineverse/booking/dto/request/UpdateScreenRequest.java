package com.cineverse.booking.dto.request;

import java.util.List;

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
    
    private List<String> features;
    
    @NotNull
    private int capacity;
}
