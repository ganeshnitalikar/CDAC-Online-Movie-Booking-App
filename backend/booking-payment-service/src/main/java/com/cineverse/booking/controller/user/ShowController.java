package com.cineverse.booking.controller.user;

import com.cineverse.booking.dto.response.ShowResponse;
import com.cineverse.booking.entity.Show;
import com.cineverse.booking.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/screens")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;
    
    

    @GetMapping("/{screenId}/shows")
    public List<ShowResponse> getShowsByScreen(
            @PathVariable Long screenId
    ) {
        return showService.getShowsByScreen(screenId);
    }
}
