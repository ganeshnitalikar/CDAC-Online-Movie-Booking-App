package com.cineverse.booking.service;

import com.cineverse.booking.dto.request.CreateTheatreRequest;
import com.cineverse.booking.dto.response.TheatreResponse;
import com.cineverse.booking.entity.Theatre;

import java.util.List;

public interface TheatreService {

    Theatre createTheatre(CreateTheatreRequest request, String ownerId);

    List<TheatreResponse> getAllTheatres();

    List<Theatre> getTheatresByOwner(String ownerId);

    Theatre getTheatreById(Long theatreId);
    
    void deleteTheatreById(Long theatreId);
}
