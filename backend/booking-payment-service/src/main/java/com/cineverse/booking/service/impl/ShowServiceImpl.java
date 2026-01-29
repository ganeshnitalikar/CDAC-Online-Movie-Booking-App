package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.CreateShowRequest;
import com.cineverse.booking.dto.response.OwnerShowResponse;
import com.cineverse.booking.dto.response.ShowResponse;
import com.cineverse.booking.dto.response.ShowSeatDetailsResponse;
import com.cineverse.booking.entity.Screen;
import com.cineverse.booking.entity.Show;
import com.cineverse.booking.entity.Theatre;
import com.cineverse.booking.exception.AccessDeniedException;
import com.cineverse.booking.exception.ResourceNotFoundException;
import com.cineverse.booking.repository.ScreenRepository;
import com.cineverse.booking.repository.ShowRepository;
import com.cineverse.booking.service.ShowService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShowServiceImpl implements ShowService {

    private final ShowRepository showRepository;
    private final ScreenRepository screenRepository;
    
    @Override
    public void deleteShow(Long showId, String ownerId) {
    	Show show = showRepository.findById(showId).orElseThrow(()-> new RuntimeException("Show Not Found"));
    	List<Show> shows = showRepository.findByScreenTheatreOwnerId(ownerId);
    	
//    	if(!shows.contains(show)) {
//    		throw new RuntimeException("You Dont Have Permission to delete this show ");
//    	}
    	
    	showRepository.delete(show);
    	
    	
    }
    
    @Override
    @Transactional
    public List<OwnerShowResponse> getShowsByOwner(String ownerId) {

        List<Show> shows =
                showRepository.findByScreenTheatreOwnerId(ownerId);

        return shows.stream()
                .map(show -> new OwnerShowResponse(
                        show.getId(),
                        show.getMovieId(),

                        show.getScreen().getId(),
                        show.getScreen().getName(),

                        show.getScreen().getTheatre().getId(),
                        show.getScreen().getTheatre().getName(),

                        show.getStartTime(),
                        show.getEndTime()
                ))
                .toList();
    }
    @Override
    @Transactional
    public List<ShowResponse> getShowsByMovie(String movieId) {

        List<Show> shows = showRepository
                .findByMovieIdAndStartTimeAfter(
                        movieId,
                        LocalDateTime.now()
                );

        if (shows.isEmpty()) {
            return List.of(); 
        }

        return shows.stream()
                .map(show -> new ShowResponse(
                        show.getId(),
                        show.getMovieId(),

                        show.getScreen().getId(),
                        show.getScreen().getName(),

                        show.getScreen().getTheatre().getId(),
                        show.getScreen().getTheatre().getName(),

                        show.getStartTime(),
                        show.getEndTime()
                ))
                .toList();
    }

    
    @Override
    @Transactional
    public List<ShowResponse> getShowsByScreen(Long screenId) {

        List<Show> shows = showRepository.findByScreenId(screenId);

        if (shows.isEmpty()) {
            throw new ResourceNotFoundException("No shows found for this screen");
        }

        return shows.stream()
                .map(show -> new ShowResponse(
                        show.getId(),
                        show.getMovieId(),

                        show.getScreen().getId(),
                        show.getScreen().getName(),

                        show.getScreen().getTheatre().getId(),
                        show.getScreen().getTheatre().getName(),

                        show.getStartTime(),
                        show.getEndTime()
                ))
                .toList();
    }

    @Override
    @Transactional
    public OwnerShowResponse createShow(
            CreateShowRequest request,
            String requesterId,
            String role
    ) {
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found"));

        if (role.equals("THEATER_OWNER") &&
            !screen.getTheatre().getOwnerId().equals(requesterId)) {
            throw new AccessDeniedException("Not your theatre");
        }

        boolean overlapExists = showRepository
                .existsByScreenIdAndTimeOverlap(
                        request.getScreenId(),
                        request.getStartTime(),
                        request.getEndTime()
                );

        if (overlapExists) {
            throw new IllegalStateException("Show overlaps with existing show");
        }

        Show show = new Show();
        show.setMovieId(request.getMovieId());
        show.setScreen(screen);
        show.setStartTime(request.getStartTime());
        show.setEndTime(request.getEndTime());

        Show saved = showRepository.save(show);

        return new OwnerShowResponse(
                saved.getId(),
                saved.getMovieId(),

                screen.getId(),
                screen.getName(),

                screen.getTheatre().getId(),
                screen.getTheatre().getName(),

                saved.getStartTime(),
                saved.getEndTime()
        );
    }


    @Transactional
    @Override
    public ShowSeatDetailsResponse getShowById(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found"));

        Screen screen = show.getScreen();
        Theatre theatre = screen.getTheatre();

        return new ShowSeatDetailsResponse(
                show.getId(),
                show.getMovieId(),
                theatre.getId(),
                theatre.getName(),
                screen.getId(),
                screen.getName(),
                show.getStartTime(),
                show.getEndTime()
        );
    }

    @Override
    public List<Show> getShowsByCity(String city) {

        List<Show> shows = showRepository
                .findByScreenTheatreCityAndStartTimeAfter(
                        city,
                        LocalDateTime.now()
                );

        if (shows.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No upcoming shows found in city: " + city
            );
        }

        return shows;
    }
}
