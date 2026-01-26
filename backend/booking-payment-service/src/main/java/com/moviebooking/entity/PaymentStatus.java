package com.moviebooking.entity;

/**
 * Enum representing the lifecycle states of a payment.
 * 
 * PENDING - Razorpay order created, awaiting payment
 * SUCCESS - Payment completed successfully
 * FAILED  - Payment failed or was cancelled
 */
public enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED
}
