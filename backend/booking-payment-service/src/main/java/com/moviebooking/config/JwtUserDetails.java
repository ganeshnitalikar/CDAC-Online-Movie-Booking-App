package com.moviebooking.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

/**
 * Utility component to extract user details from JWT token.
 */
@Component
public class JwtUserDetails {

    /**
     * Get the current authenticated user's ID.
     * The user ID is stored in the JWT 'subject' claim.
     */
    public String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt) {
            Jwt jwt = (Jwt) principal;
            return jwt.getSubject();
        }

        return null;
    }

    /**
     * Get the current authenticated user's role.
     * The role is stored in the JWT 'role' claim.
     */
    public String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt) {
            Jwt jwt = (Jwt) principal;
            return jwt.getClaimAsString("role");
        }

        return null;
    }

    /**
     * Check if current user has ADMIN role.
     */
    public boolean isAdmin() {
        return "ADMIN".equals(getCurrentUserRole());
    }

    /**
     * Check if current user has THEATRE_OWNER role.
     */
    public boolean isTheatreOwner() {
        return "THEATRE_OWNER".equals(getCurrentUserRole());
    }

    /**
     * Check if current user has USER role.
     */
    public boolean isUser() {
        return "USER".equals(getCurrentUserRole());
    }
}
