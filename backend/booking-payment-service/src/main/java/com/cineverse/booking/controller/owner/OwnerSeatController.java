package com.cineverse.booking.controller.owner;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cineverse.booking.dto.request.CreateSeatRequest;
import com.cineverse.booking.service.SeatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/booking/owner/seats")
@RequiredArgsConstructor
public class OwnerSeatController {

    private final SeatService seatService;

    /**
     * OWNER adds seats for a screen
     */
    @PostMapping
    public void createSeats(
            @Valid @RequestBody CreateSeatRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        seatService.createSeats(
                request,
                jwt.getSubject(),
                jwt.getClaimAsString("role")
        );
    }
}

