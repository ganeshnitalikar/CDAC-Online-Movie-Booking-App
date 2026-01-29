package com.cineverse.booking.controller.user;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cineverse.booking.dto.response.SeatResponse;
import com.cineverse.booking.service.SeatService;

import lombok.RequiredArgsConstructor;

@RestController

@RequestMapping("/shows")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/{showId}/seats")
    public List<SeatResponse> getSeatsForShow(
            @PathVariable Long showId
    ) {
        return seatService.getSeatsByShowId(showId);
    }
    
}
