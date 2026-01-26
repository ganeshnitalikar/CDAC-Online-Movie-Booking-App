package com.cineverse.booking.service;

import com.cineverse.booking.dto.request.RazorpayOrderRequest;
import com.cineverse.booking.dto.response.RazorpayOrderResponse;

public interface PaymentService {

    RazorpayOrderResponse createRazorpayOrder(
            RazorpayOrderRequest request,
            String userId
    );

    void handlePaymentSuccess(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    );
}
