package com.cineverse.booking.controller.user;

import com.cineverse.booking.entity.Show;
import com.cineverse.booking.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shows")
@RequiredArgsConstructor
public class ShowDetailsController {

    private final ShowService showService;

    @GetMapping("/{showId}")
    public Show getShowById(@PathVariable Long showId) {
        return showService.getShowById(showId);
    }
}
