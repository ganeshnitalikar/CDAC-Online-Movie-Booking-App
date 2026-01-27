package com.cineverse.booking.controller.owner;

import com.cineverse.booking.dto.request.CreateScreenRequest;
import com.cineverse.booking.dto.request.CreateShowRequest;
import com.cineverse.booking.dto.request.UpdateScreenRequest;
import com.cineverse.booking.dto.response.ScreenResponse;
import com.cineverse.booking.entity.Screen;
import com.cineverse.booking.entity.Show;
import com.cineverse.booking.service.ScreenService;
import com.cineverse.booking.service.ShowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking/owner")
@RequiredArgsConstructor
public class OwnerShowController {

    private final ScreenService screenService;
    private final ShowService showService;

    @PostMapping("/screens")
    public Screen createScreen(
            @Valid @RequestBody CreateScreenRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return screenService.createScreen(
                request,
                jwt.getSubject(),
                jwt.getClaim("role")
        );
    }
    @DeleteMapping("/screens/{screenId}")
    public void deleteScreen(
            @PathVariable String screenId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        screenService.deleteScreen(
                screenId,
                jwt.getSubject()
        );
    }

    @GetMapping("/screens")
    public List<ScreenResponse> getOwnerScreens(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return screenService.getScreensByOwner(jwt.getSubject());
    }

    @PostMapping("/shows")
    public Show createShow(
            @Valid @RequestBody CreateShowRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return showService.createShow(
                request,
                jwt.getSubject(),
                jwt.getClaim("role")
        );
    }
}
