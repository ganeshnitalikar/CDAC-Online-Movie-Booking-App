package com.moviebooking.service;

import com.moviebooking.dto.request.PaymentVerifyRequest;
import com.moviebooking.dto.response.RazorpayOrderResponse;

/**
 * Service interface for payment operations.
 * Integrates with Razorpay payment gateway.
 */
public interface PaymentService {

    /**
     * Create a Razorpay order for a booking.
     * Only creates order if booking is in INITIATED status and not expired.
     * 
     * Returns the order details needed by frontend to initiate payment.
     */
    RazorpayOrderResponse createPaymentOrder(Long bookingId, String userId);

    /**
     * Verify and complete payment.
     * Verifies Razorpay signature and confirms booking on success.
     * 
     * CRITICAL: This must be idempotent.
     * Same payment ID processed multiple times should have same result.
     */
    void verifyAndCompletePayment(PaymentVerifyRequest request, String userId);

    /**
     * Handle Razorpay webhook for payment events.
     * Verifies webhook signature before processing.
     * 
     * CRITICAL: This must be idempotent.
     */
    void handleWebhook(String payload, String signature);
}
