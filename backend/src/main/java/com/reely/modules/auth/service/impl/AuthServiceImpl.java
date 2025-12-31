package com.reely.modules.auth.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.ChangePasswordRequest;
import com.reely.modules.auth.dto.ResetPasswordRequest;
import com.reely.modules.auth.dto.UserClaims;
import com.reely.modules.auth.entity.PasswordResetToken;
import com.reely.modules.auth.repository.PasswordResetTokenRepository;
import com.reely.modules.auth.service.AuthService;
import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.repository.UserRepository;
import com.reely.modules.user.service.UserService;
import com.reely.util.TokenGenerator;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class AuthServiceImpl implements AuthService {

    @Value("${access.token.expiration.time}")
    private long accessTokenExpiration;

    @Value("${refresh.token.expiration.time}")
    private long refreshTokenExpiration;

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${resend.api.key}")
    private String resendApiKey;

    private JwtEncoder jwtEncoder;

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    private UserRepository userRepository;

    private PasswordResetTokenRepository passwordResetTokenRepository;

    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(JwtEncoder jwtEncoder, UserService userService,
            PasswordEncoder passwordEncoder, PasswordResetTokenRepository passwordResetTokenRepository,
            AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.jwtEncoder = jwtEncoder;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
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
        Optional<User> userOptional = this.userRepository.findByEmail(email);
        Resend resend = new Resend(resendApiKey);
        if (userOptional.isPresent()) {
            System.out.println("User existing");
            User user = userOptional.get();
            String rawToken = TokenGenerator.generateToken(32);
            String tokenHash = passwordEncoder.encode(rawToken);
            PasswordResetToken token = PasswordResetToken.builder()
                    .tokenHash(tokenHash)
                    .expiredAt(Instant.now().plus(15 * 60, ChronoUnit.SECONDS))
                    .user(user).build();
            this.passwordResetTokenRepository.save(token);

            String resetLink = "http://localhost:5173/reset-password?token=" + rawToken;
            CreateEmailOptions sendEmailRequest = CreateEmailOptions.builder()
                    .from("onboarding@resend.dev")
                    .to(email)
                    .subject("Reset Your Password for Reely")
                    .html("<p>Hello,</p>"
                            + "<p>You requested a password reset for your Reely account.</p>"
                            + "<p>Please click the link below to reset your password:</p>"
                            + "<a href='" + resetLink + "'>Reset Password</a>"
                            + "<p>If you did not request this, please ignore this email.</p>")
                    .build();

            try {
                resend.emails().send(sendEmailRequest);
            } catch (ResendException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void handleChangePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email, request.getOldPassword());
        authenticationManager.authenticate(authenticationToken);

        System.out.println(email);
        User user = this.userRepository.findByEmail(email).get();
        String hashPassword = this.passwordEncoder.encode(request.getNewPassword());

        user.setPasswordHash(hashPassword);
        this.userRepository.save(user);
        return;
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        List<PasswordResetToken> tokens = this.passwordResetTokenRepository
                .findAllByUsedAtIsNullAndExpiredAtAfter(Instant.now());
        PasswordResetToken matchedToken = null;
        for (PasswordResetToken token : tokens) {
            if (passwordEncoder.matches(request.getToken(), token.getTokenHash())) {
                matchedToken = token;
                break;
            }
        }
        if (matchedToken == null) {
            throw new RuntimeException("Token is not right or expired");
        }

        User user = matchedToken.getUser();
        String newPasswordHash = passwordEncoder.encode(request.getNewPassword());
        user.setPasswordHash(newPasswordHash);
        this.userRepository.save(user);

        matchedToken.setUsedAt(Instant.now());
        this.passwordResetTokenRepository.save(matchedToken);
    }
}
