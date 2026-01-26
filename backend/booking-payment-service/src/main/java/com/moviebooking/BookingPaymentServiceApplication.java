package com.moviebooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main entry point for the Booking & Payment microservice.
 * 
 * This service handles:
 * - Theatre management
 * - Screen and seat configuration
 * - Show scheduling
 * - Seat locking and booking
 * - Payment processing with Razorpay
 * 
 * Movie metadata is NOT stored here - only movieId references.
 */
@SpringBootApplication
@EnableScheduling
public class BookingPaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingPaymentServiceApplication.class, args);
    }
}
