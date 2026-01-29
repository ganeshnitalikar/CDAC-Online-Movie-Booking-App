package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.CreateTheatreRequest;
import com.cineverse.booking.dto.response.TheatreResponse;
import com.cineverse.booking.entity.Theatre;
import com.cineverse.booking.exception.ResourceNotFoundException;
import com.cineverse.booking.repository.TheatreRepository;
import com.cineverse.booking.service.TheatreService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TheatreServiceImpl implements TheatreService {

    private final TheatreRepository theatreRepository;

    @Override
    public Theatre createTheatre(CreateTheatreRequest request, String ownerId) {
        Theatre theatre = new Theatre();
        theatre.setName(request.getName());
        theatre.setCity(request.getCity());
        theatre.setOwnerId(ownerId);
        return theatreRepository.save(theatre);
    }

    @Override
    public void deleteTheatreById(Long theatreId) {
    	Theatre th = theatreRepository.findById(theatreId).orElseThrow(()->new RuntimeException("Theatre Does Not Exist"));
    	theatreRepository.delete(th);
    	return;
    }

    @Transactional
    public List<TheatreResponse> getAllTheatres() {
        return theatreRepository.findAll()
                .stream()
                .map(t -> new TheatreResponse(
                        t.getId(),
                        t.getName(),
                        t.getCity()
                ))
                .toList();
    }

    @Override
    public List<Theatre> getTheatresByOwner(String ownerId) {
        return theatreRepository.findByOwnerId(ownerId);
    }

    @Override
    public Theatre getTheatreById(Long theatreId) {
        return theatreRepository.findById(theatreId)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));
    }
}
