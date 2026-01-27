package com.cineverse.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class TheatreResponse {
    private Long id;
    private String name;
    private String city;
}
