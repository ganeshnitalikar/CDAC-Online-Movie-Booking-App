package com.cineverse.booking.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collections;
import java.util.List;

public class JwtRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {

        // 1. Extract role safely
        String role = jwt.getClaimAsString("role");

        List<SimpleGrantedAuthority> authorities =
                role == null
                        ? Collections.emptyList()
                        : List.of(new SimpleGrantedAuthority("ROLE_" + role));

        // 2. Determine principal (subject)
        String principal =
                jwt.getSubject() != null
                        ? jwt.getSubject()
                        : jwt.getClaimAsString("user_id");

        // 3. Build authentication token with explicit principal
        return new JwtAuthenticationToken(
                jwt,
                authorities,
                principal
        );
    }
}
