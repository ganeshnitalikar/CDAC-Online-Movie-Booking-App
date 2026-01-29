package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.CreateScreenRequest;
import com.cineverse.booking.dto.request.UpdateScreenRequest;
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

        if (role.equals("THEATER_OWNER") && !theatre.getOwnerId().equals(requesterId)) {
            throw new AccessDeniedException("You do not own this theatre");
        }
        


        Screen screen = new Screen();
        screen.setName(request.getName());
        screen.setTheatre(theatre);
        screen.setCapacity(request.getCapacity());
        screen.setFeatures(request.getFeatures());

        return screenRepository.save(screen);
    }
    
    @Override
    @Transactional
    public ScreenResponse updateScreen(
    		Long screenId, UpdateScreenRequest request ,String role
    		) {
    	Screen s = screenRepository.findById(screenId).orElseThrow(()->new RuntimeException("Screen Does Not Exist"));
    	s.setName(request.getName());
    	s.setCapacity(request.getCapacity());
    	s.setFeatures(request.getFeatures());
    	return null;
    }
    
    @Override
    @Transactional
    public void deleteScreen(String screenId, String ownerId) {

        Screen screen = screenRepository
            .findByIdAndTheatreOwnerId(Long.parseLong(screenId), ownerId)
            .orElseThrow(() ->
                new RuntimeException("Screen not found or not authorized")
            );

        if (!screen.getShows().isEmpty()) {
            throw new IllegalStateException(
                "Cannot delete screen. Shows are scheduled on this screen."
            );
        }

        screenRepository.delete(screen);
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
                        screen.getCapacity(),
                        screen.getFeatures(),
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
                          screen.getCapacity(),
                          screen.getFeatures(),
                          screen.getTheatre().getName()
                ))
                .toList();
    }

}
