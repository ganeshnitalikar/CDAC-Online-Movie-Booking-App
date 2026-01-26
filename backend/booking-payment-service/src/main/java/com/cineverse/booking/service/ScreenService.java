package com.cineverse.booking.service;

import com.cineverse.booking.dto.request.CreateScreenRequest;
import com.cineverse.booking.dto.response.ScreenResponse;
import com.cineverse.booking.entity.Screen;

import java.util.List;

public interface ScreenService {

    Screen createScreen(CreateScreenRequest request, String requesterId, String role);

    public List<ScreenResponse> getScreensByTheatre(Long theatreId);
    List<ScreenResponse> getScreensByOwner(String ownerId);
}
