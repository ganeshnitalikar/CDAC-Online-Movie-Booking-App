package com.moviebooking.repository;

import com.moviebooking.entity.Payment;
import com.moviebooking.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Payment entity operations.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payment by booking ID.
     */
    Optional<Payment> findByBookingId(Long bookingId);

    /**
     * Find payment by Razorpay order ID.
     * Used for webhook processing.
     */
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    /**
     * Find payment by Razorpay payment ID.
     * Used for idempotency check - prevents processing same payment twice.
     */
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    /**
     * Check if payment already exists for a booking.
     */
    boolean existsByBookingId(Long bookingId);

    /**
     * Find all payments with a specific status.
     */
    List<Payment> findByStatus(PaymentStatus status);
}
