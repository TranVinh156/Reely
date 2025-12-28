package com.reely.modules.auth.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.UserClaims;
import com.reely.modules.auth.entity.PasswordResetToken;
import com.reely.modules.auth.repository.PasswordResetTokenRepository;
import com.reely.modules.auth.service.AuthService;
import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.service.UserService;
import com.reely.util.EmailSending;
import com.reely.util.TokenGenerator;

import ch.qos.logback.core.subst.Token;

@Service
public class AuthServiceImpl implements AuthService {

    @Value("${access.token.expiration.time}")
    private long accessTokenExpiration;

    @Value("${refresh.token.expiration.time}")
    private long refreshTokenExpiration;

    @Value("${jwt.secret}")
    private String secretKey;

    private JwtEncoder jwtEncoder;

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    private PasswordResetTokenRepository passwordResetTokenRepository;

    private EmailSending emailSending;

    public AuthServiceImpl(JwtEncoder jwtEncoder, UserService userService,
            PasswordEncoder passwordEncoder, PasswordResetTokenRepository passwordResetTokenRepository,
            EmailSending emailSending) {
        this.jwtEncoder = jwtEncoder;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailSending = emailSending;
    }

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;

    @Override
    public String generateAccessToken(String email, UserDTO user) {
        Instant now = Instant.now();
        Instant validationTime = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        List<String> authorities = new ArrayList<>();
        authorities.add(userService.getUserRole(user.getId()).getName().toString());

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
                .claim("authorities", authorities)
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
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @Override
    public void sendForgotPasswordEmail(String email) {
        User user = this.userService.getUserEntityByEmail(email);
        if (user != null) {
            String rawToken = TokenGenerator.generateToken(32);
            String tokenHash = passwordEncoder.encode(rawToken);
            PasswordResetToken token = PasswordResetToken.builder()
                    .tokenHash(tokenHash)
                    .expiredAt(Instant.now().plus(15 * 60, ChronoUnit.SECONDS))
                    .user(user).build();
            this.passwordResetTokenRepository.save(token);
            String resetLink = "http://localhost:5173/reset-password?token=" + rawToken;
            emailSending.sendEmail(email, "Reset Password for Reely", resetLink);
        }
    }
}
