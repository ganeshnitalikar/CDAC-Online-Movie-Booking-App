package com.cineverse.booking.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RazorpayOrderResponse {

    private String razorpayOrderId;
    private Integer amount;
    private String currency;
}
