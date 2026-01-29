package com.cineverse.booking.service;


import com.cineverse.booking.dto.request.CreateSeatRequest;
import com.cineverse.booking.dto.response.SeatResponse;

import java.util.List;

public interface SeatService {

    void createSeats(
            CreateSeatRequest request,
            String ownerId,
            String role
    );

    List<SeatResponse> getSeatsByShowId(Long showId);
    

}
