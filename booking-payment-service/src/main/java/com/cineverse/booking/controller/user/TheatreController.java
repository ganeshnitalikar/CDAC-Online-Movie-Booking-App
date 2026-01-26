package com.cineverse.booking.controller.user;

import com.cineverse.booking.entity.Theatre;
import com.cineverse.booking.service.TheatreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/theatres")
@RequiredArgsConstructor
public class TheatreController {

    private final TheatreService theatreService;

    @GetMapping
    public List<Theatre> getAllTheatres(
            @RequestParam(required = false) String movieId
    ) {
        // movieId intentionally ignored for now
        return theatreService.getAllTheatres();
    }
}
