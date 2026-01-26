package com.moviebooking.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Show entity representing a movie show at a specific screen and time.
 * Only stores movieId; movie details come from another service.
 */
@Entity
@Table(name = "shows")
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Reference to the movie in the Movie Service.
     * This service does NOT store movie metadata.
     */
    @Column(name = "movie_id", nullable = false)
    private String movieId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    /**
     * Price per NORMAL seat in paise (e.g., 20000 = Rs. 200)
     */
    @Column(name = "normal_seat_price", nullable = false)
    private Integer normalSeatPrice;

    /**
     * Price per PREMIUM seat in paise (e.g., 35000 = Rs. 350)
     */
    @Column(name = "premium_seat_price", nullable = false)
    private Integer premiumSeatPrice;

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();

    // Default constructor required by JPA
    public Show() {
    }

    public Show(String movieId, Screen screen, LocalDateTime startTime, 
                LocalDateTime endTime, Integer normalSeatPrice, Integer premiumSeatPrice) {
        this.movieId = movieId;
        this.screen = screen;
        this.startTime = startTime;
        this.endTime = endTime;
        this.normalSeatPrice = normalSeatPrice;
        this.premiumSeatPrice = premiumSeatPrice;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public Screen getScreen() {
        return screen;
    }

    public void setScreen(Screen screen) {
        this.screen = screen;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getNormalSeatPrice() {
        return normalSeatPrice;
    }

    public void setNormalSeatPrice(Integer normalSeatPrice) {
        this.normalSeatPrice = normalSeatPrice;
    }

    public Integer getPremiumSeatPrice() {
        return premiumSeatPrice;
    }

    public void setPremiumSeatPrice(Integer premiumSeatPrice) {
        this.premiumSeatPrice = premiumSeatPrice;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    /**
     * Get price for a specific seat type
     */
    public Integer getPriceForSeatType(SeatType seatType) {
        return seatType == SeatType.PREMIUM ? premiumSeatPrice : normalSeatPrice;
    }
}
