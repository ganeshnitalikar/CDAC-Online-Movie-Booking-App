package com.cineverse.booking.controller.user;

import com.cineverse.booking.dto.response.ScreenResponse;
import com.cineverse.booking.entity.Screen;
import com.cineverse.booking.service.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/theatres")
@RequiredArgsConstructor
public class ScreenController {

    private final ScreenService screenService;

    @GetMapping("/{theatreId}/screens")
    public List<ScreenResponse> getScreensByTheatre(
            @PathVariable Long theatreId
    ) {
        return screenService.getScreensByTheatre(theatreId);
    }

}
