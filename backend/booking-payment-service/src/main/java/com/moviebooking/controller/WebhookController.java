package com.moviebooking.controller;

import com.moviebooking.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for webhook endpoints.
 * 
 * Handles callbacks from external services like Razorpay.
 * These endpoints are NOT authenticated but use signature verification.
 */
@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);

    private final PaymentService paymentService;

    public WebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Handle Razorpay webhook events.
     * 
     * Razorpay sends events for:
     * - payment.captured (payment successful)
     * - payment.failed (payment failed)
     * 
     * IMPORTANT: 
     * - Always return 200 OK, even on errors (to prevent retries)
     * - Signature is verified in service layer
     * - Must be idempotent
     */
    @PostMapping("/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        
        logger.info("Received Razorpay webhook");
        
        if (signature == null || signature.isEmpty()) {
            logger.warn("Razorpay webhook received without signature");
            return ResponseEntity.ok("OK");
        }

        try {
            paymentService.handleWebhook(payload, signature);
            logger.info("Razorpay webhook processed successfully");
        } catch (Exception e) {
            // Log error but return OK to prevent Razorpay from retrying
            logger.error("Error processing Razorpay webhook: {}", e.getMessage(), e);
        }

        return ResponseEntity.ok("OK");
    }
}
