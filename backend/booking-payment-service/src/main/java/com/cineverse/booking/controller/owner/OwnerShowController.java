package com.cineverse.booking.controller.owner;

import com.cineverse.booking.dto.request.CreateScreenRequest;
import com.cineverse.booking.dto.request.CreateShowRequest;
import com.cineverse.booking.dto.request.UpdateScreenRequest;
import com.cineverse.booking.dto.response.OwnerShowResponse;
import com.cineverse.booking.dto.response.ScreenResponse;
import com.cineverse.booking.dto.response.ShowResponse;
import com.cineverse.booking.entity.Screen;
import com.cineverse.booking.entity.Show;
import com.cineverse.booking.service.ScreenService;
import com.cineverse.booking.service.ShowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking/owner")
@RequiredArgsConstructor
public class OwnerShowController {

    private final ScreenService screenService;
    private final ShowService showService;
    
    /*
     * add a new screen 
     * ROLE - THEATER_OWNER
     * 
     */

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
    /*
     * update a existing screen
     * ROLE - THEATER_OWNER
     */
    
    @PutMapping("/screens/{screenId}")
    public void updateScreen(
    		@RequestBody UpdateScreenRequest request,
            @PathVariable Long screenId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        screenService.updateScreen(
                screenId,
                request,
                jwt.getSubject()
        );
    }
    
    /*
     * deletes existing screen
     * fails if screen has scheduled shows
     */
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
    
    /*
     * get all screens for a particular owner
     * 
     */
    @GetMapping("/screens")
    public List<ScreenResponse> getOwnerScreens(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return screenService.getScreensByOwner(jwt.getSubject());
    }
    
    /*
     * get all shows for a owner
     */
    @GetMapping("/shows")
    public List<OwnerShowResponse> getOwnerShows(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return showService.getShowsByOwner(jwt.getSubject());
    }

    /*
     * create a new show for a movie , screen
     */
    @PostMapping("/shows")
    public OwnerShowResponse createShow(
            @Valid @RequestBody CreateShowRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return showService.createShow(
                request,
                jwt.getSubject(),
                jwt.getClaim("role") 
        );
    }
    /*
     * delete a show 
     * 
     */
    @DeleteMapping("/shows/{showId}")
    public ResponseEntity<?> deleteShow(
    		@PathVariable Long showId,
    		@AuthenticationPrincipal Jwt jwt
    		){
    	showService.deleteShow(
    			showId,
    			jwt.getSubject()
    			);
    	return ResponseEntity.ok("Deleted");
    }
}
