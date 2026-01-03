package com.reely.config;

import java.util.Arrays;
import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String secretKey;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(c -> c.disable())
                .authorizeHttpRequests(
                        (authz) -> authz
                                .requestMatchers(HttpMethod.GET, "/api/v1/users").hasAuthority("SUPER_ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/v1/comments/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/likes/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/api/v1/likes/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/reports/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/api/v1/reports/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/notifications/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/upload/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/videos/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/api/v1/users/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/users/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**").authenticated()
                                .requestMatchers("/api/v1/auth/me").authenticated()
                                .requestMatchers("/api/v1/auth/change-password").authenticated()
                                .requestMatchers("/api/v1/auth/logout").authenticated()
                                .anyRequest().permitAll())
                .addFilterBefore(headerAuthenticationFilter(), AuthorizationFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    public HeaderAuthenticationFilter headerAuthenticationFilter() {
        return new HeaderAuthenticationFilter();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.getUrlDecoder().decode(secretKey);
        return new SecretKeySpec(keyBytes, MacAlgorithm.HS256.getName());
    }
}
