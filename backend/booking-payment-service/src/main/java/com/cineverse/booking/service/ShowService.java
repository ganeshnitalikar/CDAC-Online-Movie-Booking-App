package com.cineverse.booking.service;

import com.cineverse.booking.dto.request.CreateShowRequest;
import com.cineverse.booking.dto.response.OwnerShowResponse;
import com.cineverse.booking.dto.response.ShowResponse;
import com.cineverse.booking.dto.response.ShowSeatDetailsResponse;
import com.cineverse.booking.entity.Show;

import java.util.List;

public interface ShowService {

    OwnerShowResponse createShow(CreateShowRequest request, String requesterId, String role);

    List<Show> getShowsByCity(String city);

    ShowSeatDetailsResponse getShowById(Long showId);

    List<ShowResponse> getShowsByScreen(Long screenId);
    List<OwnerShowResponse> getShowsByOwner(String ownerId);
    List<ShowResponse> getShowsByMovie(String movieId);

	void deleteShow(Long showId, String ownerId);
}
