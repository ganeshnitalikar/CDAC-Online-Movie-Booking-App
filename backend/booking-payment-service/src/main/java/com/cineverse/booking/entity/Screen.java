package com.cineverse.booking.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "screens")
@Getter
@Setter
@NoArgsConstructor
public class Screen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    
    private int capacity;
    
    private List<String> features;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theatre_id", nullable = false)
    private Theatre theatre;
    
    @OneToMany(
    	    mappedBy = "screen",
    	    cascade = CascadeType.ALL,
    	    orphanRemoval = true
    	)
    	private List<Seat> seats = new ArrayList<>();
    @OneToMany(
    	    mappedBy = "screen",
    	    fetch = FetchType.LAZY
    	)
    	private List<Show> shows = new ArrayList<>();

}
