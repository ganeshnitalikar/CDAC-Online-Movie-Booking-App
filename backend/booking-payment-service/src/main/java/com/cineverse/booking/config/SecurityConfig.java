package com.cineverse.booking.config;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth

                // Razorpay webhook (signature protected)
                .requestMatchers("/booking/webhooks/**").permitAll()

                // ADMIN
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // THEATRE OWNER
                .requestMatchers("/owner/**", "/booking/owner/**").hasRole("THEATER_OWNER")
                
                // USER
                .requestMatchers("/user/**", "/booking/user/**").hasRole("USER")
                //public routes
                .requestMatchers(
                	    "/theatres/**",
                	    "/screens/**",
                	    "/shows/**",
                	    "/movies/**",
                	    "/public/**",
                	    "/swagger-ui/**"
                	).permitAll()


                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth ->
                oauth.jwt(jwt ->
                    jwt
                        .decoder(jwtDecoder())
                        .jwtAuthenticationConverter(new JwtRoleConverter())
                )
            );

        return http.build();
    }

    /**
     *  JWT Decoder for HMAC (shared secret)
     */
    @Bean
    public JwtDecoder jwtDecoder() {

        SecretKeySpec secretKey =
                new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256");

        return NimbusJwtDecoder.withSecretKey(secretKey).build();
    }
}
