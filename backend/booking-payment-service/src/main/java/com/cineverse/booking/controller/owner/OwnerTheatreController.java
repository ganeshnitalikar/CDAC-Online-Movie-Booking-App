package com.cineverse.booking.controller.owner;

import com.cineverse.booking.dto.request.CreateTheatreRequest;
import com.cineverse.booking.dto.response.TheatreResponse;
import com.cineverse.booking.entity.Theatre;
import com.cineverse.booking.service.TheatreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("booking/owner/theatres")
@RequiredArgsConstructor
public class OwnerTheatreController {

    private final TheatreService theatreService;

    /**
     * Add a new theatre (THEATRE_OWNER)
     */
    @PostMapping
    public TheatreResponse createTheatre(
            @Valid @RequestBody CreateTheatreRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Theatre theatre = theatreService.createTheatre(request, jwt.getSubject());

        return new TheatreResponse(
                theatre.getId(),
                theatre.getName(),
                theatre.getCity()
        );
    }

    /**
     * Get theatres owned by logged-in owner
     */
    @GetMapping
    public List<TheatreResponse> getOwnerTheatres(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return theatreService.getTheatresByOwner(jwt.getSubject())
                .stream()
                .map(t -> new TheatreResponse(
                        t.getId(),
                        t.getName(),
                        t.getCity()
                ))
                .toList();
    }
}
