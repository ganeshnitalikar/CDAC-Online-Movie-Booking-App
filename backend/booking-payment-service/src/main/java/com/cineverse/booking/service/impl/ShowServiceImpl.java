package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.CreateShowRequest;
import com.cineverse.booking.dto.response.ShowResponse;
import com.cineverse.booking.entity.Screen;
import com.cineverse.booking.entity.Show;
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
    public Show createShow(CreateShowRequest request, String requesterId, String role) {

        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new RuntimeException("Screen not found"));

        if (role.equals("THEATER_OWNER") &&
            !screen.getTheatre().getOwnerId().equals(requesterId)) {
            throw new AccessDeniedException("Not your theatre");
        }

        Show show = new Show();
        show.setMovieId(request.getMovieId());
        show.setScreen(screen);
        show.setStartTime(request.getStartTime());
        show.setEndTime(request.getEndTime());

        return showRepository.save(show);
    }

    @Override
    public Show getShowById(Long showId) {
        return showRepository.findById(showId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));
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
