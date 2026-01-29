package com.cineverse.booking.controller.user;

import com.cineverse.booking.dto.response.ShowResponse;
import com.cineverse.booking.dto.response.ShowSeatDetailsResponse;
import com.cineverse.booking.entity.Show;
import com.cineverse.booking.service.ShowService;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shows")
@RequiredArgsConstructor
public class ShowDetailsController {

    private final ShowService showService;
    
//    @GetMapping("/{showId}")
//    public Map<String, Object> test(@PathVariable Long showId) {
//        Map<String, Object> map = new HashMap<>();
//        map.put("id", showId);
//        return map;
//    }
    @GetMapping
    public List<ShowResponse> getShowsByMovie(
            @RequestParam String movieId
    ) {
        return showService.getShowsByMovie(movieId);
    }

    @GetMapping("/{showId}")
    public ShowSeatDetailsResponse getShowById(
            @PathVariable Long showId
    ) {
        return showService.getShowById(showId);
    }
}
