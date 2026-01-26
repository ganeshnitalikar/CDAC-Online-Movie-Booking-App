package com.moviebooking.service.impl;

import com.moviebooking.dto.request.PaymentVerifyRequest;
import com.moviebooking.dto.response.RazorpayOrderResponse;
import com.moviebooking.entity.Booking;
import com.moviebooking.entity.BookingStatus;
import com.moviebooking.entity.Payment;
import com.moviebooking.entity.PaymentStatus;
import com.moviebooking.exception.AccessDeniedException;
import com.moviebooking.exception.BookingExpiredException;
import com.moviebooking.exception.InvalidOperationException;
import com.moviebooking.exception.PaymentException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.integration.RazorpayService;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.PaymentRepository;
import com.moviebooking.service.BookingService;
import com.moviebooking.service.PaymentService;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Implementation of PaymentService.
 * Handles Razorpay payment integration.
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final RazorpayService razorpayService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              BookingRepository bookingRepository,
                              BookingService bookingService,
                              RazorpayService razorpayService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
        this.razorpayService = razorpayService;
    }

    @Override
    @Transactional
    public RazorpayOrderResponse createPaymentOrder(Long bookingId, String userId) {
        logger.info("Creating payment order for booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Check ownership
        if (!booking.getUserId().equals(userId)) {
            throw new AccessDeniedException("Booking", bookingId);
        }

        // Check booking status
        if (booking.getStatus() != BookingStatus.INITIATED) {
            throw new InvalidOperationException(
                "Payment can only be initiated for INITIATED bookings. Current status: " + booking.getStatus()
            );
        }

        // Check if booking has expired
        if (booking.isLockExpired()) {
            throw new BookingExpiredException(
                "Booking has expired. Please start a new booking.", bookingId
            );
        }

        // Check if payment already exists
        Optional<Payment> existingPayment = paymentRepository.findByBookingId(bookingId);
        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();
            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                throw new InvalidOperationException("Payment already completed for this booking");
            }
            // Return existing pending order
            if (payment.getStatus() == PaymentStatus.PENDING) {
                logger.info("Returning existing payment order: {}", payment.getRazorpayOrderId());
                return new RazorpayOrderResponse(
                    bookingId,
                    payment.getRazorpayOrderId(),
                    payment.getAmount(),
                    "INR",
                    razorpayKeyId
                );
            }
        }

        // Create Razorpay order
        String orderId = razorpayService.createOrder(
            booking.getTotalAmount(),
            "INR",
            "booking_" + bookingId
        );

        // Save payment record
        Payment payment = new Payment(booking, orderId, booking.getTotalAmount());
        paymentRepository.save(payment);

        logger.info("Payment order created: {} for booking: {}", orderId, bookingId);

        return new RazorpayOrderResponse(
            bookingId,
            orderId,
            booking.getTotalAmount(),
            "INR",
            razorpayKeyId
        );
    }

    @Override
    @Transactional
    public void verifyAndCompletePayment(PaymentVerifyRequest request, String userId) {
        logger.info("Verifying payment for order: {}", request.getRazorpayOrderId());

        // Find payment by order ID
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Payment not found for order: " + request.getRazorpayOrderId()
            ));

        // Check ownership
        if (!payment.getBooking().getUserId().equals(userId)) {
            throw new AccessDeniedException("Payment", payment.getId());
        }

        // IDEMPOTENCY CHECK: If already processed, return success
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            logger.info("Payment already processed successfully: {}", payment.getRazorpayPaymentId());
            return;
        }

        // IDEMPOTENCY CHECK: Same payment ID already processed
        if (request.getRazorpayPaymentId() != null) {
            Optional<Payment> existingPayment = paymentRepository.findByRazorpayPaymentId(
                request.getRazorpayPaymentId()
            );
            if (existingPayment.isPresent()) {
                logger.info("Payment ID already processed: {}", request.getRazorpayPaymentId());
                return;
            }
        }

        // Check booking hasn't expired
        Booking booking = payment.getBooking();
        if (booking.isLockExpired() || booking.getStatus() != BookingStatus.INITIATED) {
            payment.markFailed();
            paymentRepository.save(payment);
            throw new BookingExpiredException(
                "Booking has expired. Please start a new booking.", booking.getId()
            );
        }

        // Verify signature with Razorpay
        boolean isValid = razorpayService.verifyPaymentSignature(
            request.getRazorpayOrderId(),
            request.getRazorpayPaymentId(),
            request.getRazorpaySignature()
        );

        if (!isValid) {
            logger.error("Invalid payment signature for order: {}", request.getRazorpayOrderId());
            payment.markFailed();
            paymentRepository.save(payment);
            throw new PaymentException("Payment signature verification failed", "INVALID_SIGNATURE");
        }

        // Mark payment as successful
        payment.markSuccess(request.getRazorpayPaymentId(), request.getRazorpaySignature());
        paymentRepository.save(payment);

        // Confirm booking
        bookingService.confirmBooking(booking.getId());

        logger.info("Payment completed and booking confirmed. Order: {}, Payment: {}", 
            request.getRazorpayOrderId(), request.getRazorpayPaymentId());
    }

    @Override
    @Transactional
    public void handleWebhook(String payload, String signature) {
        logger.info("Processing Razorpay webhook");

        // Verify webhook signature
        if (!razorpayService.verifyWebhookSignature(payload, signature)) {
            logger.error("Invalid webhook signature");
            throw new PaymentException("Invalid webhook signature", "INVALID_WEBHOOK_SIGNATURE");
        }

        // Parse payload
        JSONObject event = new JSONObject(payload);
        String eventType = event.getString("event");

        logger.info("Webhook event type: {}", eventType);

        if ("payment.captured".equals(eventType)) {
            handlePaymentCaptured(event);
        } else if ("payment.failed".equals(eventType)) {
            handlePaymentFailed(event);
        }
    }

    private void handlePaymentCaptured(JSONObject event) {
        JSONObject payloadEntity = event.getJSONObject("payload")
            .getJSONObject("payment")
            .getJSONObject("entity");
        
        String paymentId = payloadEntity.getString("id");
        String orderId = payloadEntity.getString("order_id");

        logger.info("Processing payment.captured for order: {}, payment: {}", orderId, paymentId);

        // IDEMPOTENCY CHECK
        Optional<Payment> existingByPaymentId = paymentRepository.findByRazorpayPaymentId(paymentId);
        if (existingByPaymentId.isPresent()) {
            logger.info("Payment already processed via webhook: {}", paymentId);
            return;
        }

        Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            logger.warn("No payment found for order: {}", orderId);
            return;
        }

        Payment payment = paymentOpt.get();
        
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            logger.info("Payment already successful: {}", orderId);
            return;
        }

        Booking booking = payment.getBooking();
        
        // Check if booking can still be confirmed
        if (booking.getStatus() == BookingStatus.INITIATED && !booking.isLockExpired()) {
            payment.setRazorpayPaymentId(paymentId);
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            
            bookingService.confirmBooking(booking.getId());
            logger.info("Booking confirmed via webhook: {}", booking.getId());
        } else {
            // Payment came too late, booking expired
            payment.setRazorpayPaymentId(paymentId);
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            logger.warn("Payment received but booking already expired/invalid: {}", booking.getId());
            // TODO: Initiate refund
        }
    }

    private void handlePaymentFailed(JSONObject event) {
        JSONObject payloadEntity = event.getJSONObject("payload")
            .getJSONObject("payment")
            .getJSONObject("entity");
        
        String orderId = payloadEntity.getString("order_id");

        logger.info("Processing payment.failed for order: {}", orderId);

        Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            logger.warn("No payment found for failed order: {}", orderId);
            return;
        }

        Payment payment = paymentOpt.get();
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            payment.markFailed();
            paymentRepository.save(payment);
            logger.info("Payment marked as failed: {}", orderId);
        }
    }
}
