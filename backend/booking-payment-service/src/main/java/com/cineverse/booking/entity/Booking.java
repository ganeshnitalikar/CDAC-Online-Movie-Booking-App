package com.cineverse.booking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(
    name = "bookings",
    indexes = {
        @Index(name = "idx_booking_show_status", columnList = "show_id,status"),
        @Index(name = "idx_booking_lock_expiry", columnList = "lock_expiry_time")
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // from JWT subject
    @Column(nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @ManyToMany
    @JoinTable(
        name = "booking_seats",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "seat_id")
    )
    private Set<Seat> seats;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    // critical for seat lock expiry
    @Column(name = "lock_expiry_time", nullable = false)
    private LocalDateTime lockExpiryTime;
}
