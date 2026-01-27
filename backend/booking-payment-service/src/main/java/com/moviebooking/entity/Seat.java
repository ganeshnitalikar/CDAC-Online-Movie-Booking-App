package com.moviebooking.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.FetchType;
import java.util.HashSet;
import java.util.Set;

/**
 * Seat entity representing a physical seat in a screen.
 * Seats have a label (e.g., "A1"), row label, and type.
 */
@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Label of the seat (e.g., "1", "2", "3")
     */
    @Column(name = "seat_label", nullable = false)
    private String seatLabel;

    /**
     * Row label (e.g., "A", "B", "C")
     */
    @Column(name = "row_label", nullable = false)
    private String rowLabel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    /**
     * Bookings that include this seat.
     * This is the inverse side of the many-to-many relationship.
     */
    @ManyToMany(mappedBy = "seats", fetch = FetchType.LAZY)
    private Set<Booking> bookings = new HashSet<>();

    // Default constructor required by JPA
    public Seat() {
    }

    public Seat(String seatLabel, String rowLabel, SeatType type, Screen screen) {
        this.seatLabel = seatLabel;
        this.rowLabel = rowLabel;
        this.type = type;
        this.screen = screen;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatLabel() {
        return seatLabel;
    }

    public void setSeatLabel(String seatLabel) {
        this.seatLabel = seatLabel;
    }

    public String getRowLabel() {
        return rowLabel;
    }

    public void setRowLabel(String rowLabel) {
        this.rowLabel = rowLabel;
    }

    public SeatType getType() {
        return type;
    }

    public void setType(SeatType type) {
        this.type = type;
    }

    public Screen getScreen() {
        return screen;
    }

    public void setScreen(Screen screen) {
        this.screen = screen;
    }

    public Set<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(Set<Booking> bookings) {
        this.bookings = bookings;
    }

    /**
     * Returns the full seat identifier (e.g., "A1", "B5")
     */
    public String getFullSeatLabel() {
        return rowLabel + seatLabel;
    }
}
