package com.cineverse.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ScreenResponse {

    private Long id;
    private String name;
    private Long theatreId;
    private String theatreName;
}
