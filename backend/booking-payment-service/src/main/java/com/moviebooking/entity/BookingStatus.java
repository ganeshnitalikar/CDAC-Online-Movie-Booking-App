package com.moviebooking.entity;

/**
 * Enum representing the lifecycle states of a booking.
 * 
 * INITIATED - Booking created, seats locked, awaiting payment
 * CONFIRMED - Payment successful, booking is confirmed
 * EXPIRED   - Lock expired without payment, seats released
 */
public enum BookingStatus {
    INITIATED,
    CONFIRMED,
    EXPIRED
}
