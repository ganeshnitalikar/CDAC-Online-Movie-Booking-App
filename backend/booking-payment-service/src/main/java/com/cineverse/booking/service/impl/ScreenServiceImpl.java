package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.CreateScreenRequest;
import com.cineverse.booking.dto.response.ScreenResponse;
import com.cineverse.booking.entity.Screen;
import com.cineverse.booking.entity.Theatre;
import com.cineverse.booking.exception.AccessDeniedException;
import com.cineverse.booking.exception.ResourceNotFoundException;
import com.cineverse.booking.repository.ScreenRepository;
import com.cineverse.booking.repository.TheatreRepository;
import com.cineverse.booking.service.ScreenService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.hibernate.ReadOnlyMode;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScreenServiceImpl implements ScreenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;

    @Override
    public Screen createScreen(CreateScreenRequest request, String requesterId, String role) {

        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() -> new RuntimeException("Theatre not found"));

        if (role.equals("c") && !theatre.getOwnerId().equals(requesterId)) {
            throw new AccessDeniedException("You do not own this theatre");
        }

        Screen screen = new Screen();
        screen.setName(request.getName());
        screen.setTheatre(theatre);

        return screenRepository.save(screen);
    }
    
    @Override
    @Transactional()
    public List<ScreenResponse> getScreensByOwner(String ownerId) {

        List<Screen> screens =
                screenRepository.findByTheatreOwnerId(ownerId);

        return screens.stream()
                .map(screen -> new ScreenResponse(
                        screen.getId(),
                        screen.getName(),
                        screen.getTheatre().getId(),
                        screen.getTheatre().getName()
                ))
                .toList();
    }
    
    @Override
    @Transactional
    public List<ScreenResponse> getScreensByTheatre(Long theatreId) {

        List<Screen> screens = screenRepository.findByTheatreId(theatreId);

        if (screens.isEmpty()) {
            throw new ResourceNotFoundException("No screens found for theatre");
        }

        return screens.stream()
                .map(screen -> new ScreenResponse(
                        screen.getId(),
                        screen.getName(),
                        screen.getTheatre().getId(),
                        screen.getTheatre().getName()
                ))
                .toList();
    }

}
