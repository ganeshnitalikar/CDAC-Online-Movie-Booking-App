package com.cineverse.booking.dto.response;

import java.util.List;

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
    private int capacity;
    private List<String> features;
    private String theatreName;
}
