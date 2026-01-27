package com.cineverse.booking.controller.admin;

import com.cineverse.booking.dto.request.CreateTheatreRequest;
import com.cineverse.booking.dto.response.TheatreResponse;
import com.cineverse.booking.entity.Theatre;
import com.cineverse.booking.service.TheatreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking/admin/theatres")
@RequiredArgsConstructor
public class AdminTheatreController {

    private final TheatreService theatreService;

    @PostMapping
    public Theatre createTheatre(
            @Valid @RequestBody CreateTheatreRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String ownerId = jwt.getSubject(); // ADMIN onboarding theatre
        return theatreService.createTheatre(request, ownerId);
    }

    @GetMapping
    public List<TheatreResponse> getAllTheatres() {
        return theatreService.getAllTheatres();
    }
}
