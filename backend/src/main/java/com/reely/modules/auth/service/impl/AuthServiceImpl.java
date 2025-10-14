package com.reely.modules.auth.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.UserClaims;
import com.reely.modules.auth.dto.UserDTO;
import com.reely.modules.auth.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final JwtEncoder jwtEncoder;
    @Value("${access.token.expiration.time}")
    private long accessTokenExpiration;

    @Value("${refresh.token.expiration.time}")
    private long refreshTokenExpiration;

    public static final MacAlgorithm JW_ALGORITHM = MacAlgorithm.HS256;

    AuthServiceImpl(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    @Override
    public String generateAccessToken(String email, String secret, String iss, UserDTO user) {
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
                .issuer(iss)
                .claim("user", userClaims)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JW_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claimsSet)).getTokenValue();
    }

    @Override
    public String generateRefreshToken(String email, UserDTO user) {
        throw new UnsupportedOperationException("Unimplemented method 'createRefreshToken'");
    }

    @Override
    public Jwt checkValidRefreshToken(String refreshToken) {
        throw new UnsupportedOperationException("Unimplemented method 'checkValidRefreshToken'");
    }

}
