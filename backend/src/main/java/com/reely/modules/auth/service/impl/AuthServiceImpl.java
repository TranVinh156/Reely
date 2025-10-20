package com.reely.modules.auth.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.UserClaims;
import com.reely.modules.auth.service.AuthService;
import com.reely.modules.user.dto.UserDTO;

@Service
public class AuthServiceImpl implements AuthService {

    @Value("${access.token.expiration.time}")
    private long accessTokenExpiration;

    @Value("${refresh.token.expiration.time}")
    private long refreshTokenExpiration;

    @Value("${jwt.secret}")
    private String secretKey;

    private JwtEncoder jwtEncoder;

    private JwtDecoder jwtDecoder;

    public AuthServiceImpl(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;

    @Override
    public String generateAccessToken(String email, UserDTO user) {
        Instant now = Instant.now();
        Instant validationTime = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        UserClaims userClaims = UserClaims.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .id(user.getId())
                .build();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuedAt(now)
                .subject(email)
                .expiresAt(validationTime)
                .issuer(email)
                .claim("user", userClaims)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claimsSet)).getTokenValue();
    }

    @Override
    public String generateRefreshToken(String email, UserDTO user) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);

        UserClaims userClaims = UserClaims.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .id(user.getId()).build();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userClaims)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claimsSet)).getTokenValue();
    }

    @Override
    public Jwt checkValidRefreshToken(String refreshToken) {
        try {
            return jwtDecoder.decode(refreshToken);
        } catch (Exception e) {
            throw e;
        }
    }
}
