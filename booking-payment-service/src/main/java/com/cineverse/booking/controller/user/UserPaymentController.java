package com.cineverse.booking.controller.user;

import com.cineverse.booking.dto.request.RazorpayOrderRequest;
import com.cineverse.booking.dto.response.RazorpayOrderResponse;
import com.cineverse.booking.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking/user/payments")
@RequiredArgsConstructor
public class UserPaymentController {

    private final PaymentService paymentService;

    @PostMapping("/order")
    public RazorpayOrderResponse createOrder(
            @Valid @RequestBody RazorpayOrderRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return paymentService.createRazorpayOrder(
                request,
                jwt.getSubject()
        );
    }
}
