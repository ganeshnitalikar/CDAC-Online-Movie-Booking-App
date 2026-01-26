package com.cineverse.booking.service.impl;

import com.cineverse.booking.dto.request.RazorpayOrderRequest;
import com.cineverse.booking.dto.response.RazorpayOrderResponse;
import com.cineverse.booking.entity.*;
import com.cineverse.booking.exception.BookingExpiredException;
import com.cineverse.booking.exception.PaymentException;
import com.cineverse.booking.repository.BookingRepository;
import com.cineverse.booking.repository.PaymentRepository;
import com.cineverse.booking.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpayClient;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(
            RazorpayOrderRequest request,
            String userId
    ) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new PaymentException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new PaymentException("Unauthorized booking access");
        }

        if (booking.getStatus() != BookingStatus.INITIATED ||
            booking.getLockExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BookingExpiredException("Booking expired");
        }

        // prevent duplicate order creation
        paymentRepository.findByBookingId(booking.getId())
                .ifPresent(p -> {
                    throw new PaymentException("Payment already initiated");
                });

        int amount = booking.getSeats().size() * 20000; // ₹200 per seat

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + booking.getId());

            Order order = razorpayClient.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setRazorpayOrderId(order.get("id"));
            payment.setStatus(PaymentStatus.PENDING);
            payment.setAmount(amount);
            payment.setCreatedAt(LocalDateTime.now());

            paymentRepository.save(payment);

            RazorpayOrderResponse response = new RazorpayOrderResponse();
            response.setRazorpayOrderId(order.get("id"));
            response.setAmount(amount);
            response.setCurrency("INR");

            return response;

        } catch (Exception e) {
            throw new PaymentException("Failed to create Razorpay order");
        }
    }

    @Override
    @Transactional
    public void handlePaymentSuccess(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) {

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new PaymentException("Payment record not found"));

        // idempotency check
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return;
        }

        Booking booking = payment.getBooking();

        if (booking.getStatus() != BookingStatus.INITIATED) {
            throw new PaymentException("Invalid booking state");
        }

        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }
}
