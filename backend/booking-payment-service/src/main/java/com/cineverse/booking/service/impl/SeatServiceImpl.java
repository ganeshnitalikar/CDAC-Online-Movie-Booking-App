package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.CreateSeatRequest;
import com.cineverse.booking.dto.request.SeatDto;
import com.cineverse.booking.dto.response.SeatResponse;
import com.cineverse.booking.entity.Screen;
import com.cineverse.booking.entity.Seat;
import com.cineverse.booking.entity.Show;
import com.cineverse.booking.exception.AccessDeniedException;
import com.cineverse.booking.exception.ResourceNotFoundException;
import com.cineverse.booking.repository.ScreenRepository;
import com.cineverse.booking.repository.SeatRepository;
import com.cineverse.booking.repository.ShowRepository;
import com.cineverse.booking.service.SeatService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;


    @Override
    @Transactional
    public void createSeats(
            CreateSeatRequest request,
            String ownerId,
            String role
    ) {
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found"));

        if (role.equals("THEATER_OWNER") &&
            !screen.getTheatre().getOwnerId().equals(ownerId)) {
            throw new AccessDeniedException("Not your theatre");
        }

        // ❗ Seats should be created ONCE per screen
        List<Seat> existingSeats = seatRepository.findByScreenId(screen.getId());
        if (!existingSeats.isEmpty()) {
            throw new IllegalStateException("Seats already exist for this screen");
        }

        for (CreateSeatRequest.SeatInput input : request.getSeats()) {

            Seat seat = new Seat();
            seat.setRowLabel(input.getRowLabel());
            seat.setSeatNumber(input.getSeatNumber());

            seat.setSeatLabel(
                input.getRowLabel() + input.getSeatNumber()
            );

            seat.setType(input.getType());
            seat.setScreen(screen);

            seatRepository.save(seat);
        }
    }


    @Override
    @Transactional
    public List<SeatResponse> getSeatsByShowId(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found"));

        Long screenId = show.getScreen().getId();

        return seatRepository.findByScreenId(screenId)
                .stream()
                .map(seat -> new SeatResponse(
                        seat.getId(),
                        seat.getRowLabel(),
                        seat.getSeatNumber(),
                        seat.getSeatLabel(),
                        seat.getType()
                ))
                .toList();
    }
}
