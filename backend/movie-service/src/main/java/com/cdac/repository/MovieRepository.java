package com.cdac.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.cdac.entities.Movie;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    /**
     * Publicly visible movies
     * approved = true AND active = true
     */
    List<Movie> findByApprovedTrueAndActiveTrue();

    /**
     * Fetch movie by id and creator (ownership validation)
     */
    Optional<Movie> findByIdAndCreatedByUserId(String id, String createdByUserId);

    /**
     * Movies created by a specific theatre owner
     */
    List<Movie> findByCreatedByUserId(String createdByUserId);

    /**
     * Movies pending approval (Admin use)
     */
    List<Movie> findByApprovedFalse();
}
