package com.cineverse.booking.dto.response;

import com.cineverse.booking.entity.SeatStatus;
import com.cineverse.booking.entity.SeatType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SeatResponse {

    private Long seatId;
    private String rowLabel;
    private String seatNumber;
    private String seatLabel;
    private SeatType type;
    private SeatStatus status; 
}
