package com.reely.modules.auth.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reely.gateway.KongService;
import com.reely.modules.auth.dto.LoginRequest;
import com.reely.modules.auth.dto.LoginResponse;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.auth.dto.UserDTO;
import com.reely.modules.auth.entity.User;
import com.reely.modules.auth.service.AuthService;
import com.reely.modules.auth.service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class AuthController {
        private final AuthenticationManager authenticationManager;
        private final AuthService authService;
        private final PasswordEncoder passwordEncoder;
        private final KongService kongService;
        private final UserService userService;

        @Value("${refresh.token.expiration.time}")
        private long refreshTokenExpiration;

        @Value("${jwt.secret}")
        private String secretKey;

        public AuthController(AuthenticationManager authenticationManager,
                        AuthService authService, PasswordEncoder passwordEncoder, KongService kongService,
                        UserService userService) {
                this.authenticationManager = authenticationManager;
                this.userService = userService;
                this.authService = authService;
                this.passwordEncoder = passwordEncoder;
                this.kongService = kongService;
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(), loginRequest.getPassword());
                Authentication authentication = authenticationManager.authenticate(authenticationToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String email = loginRequest.getEmail();
                User user = this.userService.getUserByEmail(email);
                UserDTO userDTO = new UserDTO(user);

                Map<String, Object> jwtCredential = this.kongService.getJwtCredential(email);
                String iss = (String) jwtCredential.get("key");
                String accessToken = this.authService.generateAccessToken(userDTO.getEmail(),
                                iss, userDTO);
                String refreshToken = this.authService.generateRefreshToken(userDTO.getEmail(), userDTO);

                LoginResponse response = new LoginResponse(accessToken, userDTO);

                ResponseCookie cookies = ResponseCookie
                                .from("refresh_token", refreshToken)
                                .path("/")
                                .maxAge(refreshTokenExpiration)
                                .secure(true)
                                .httpOnly(true)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookies.toString())
                                .body(response);
        }

        @PostMapping("/register")
        public ResponseEntity<Void> register(@RequestBody RegistrationRequest request) {
                String hashPassword = this.passwordEncoder.encode(request.getPassword());
                request.setPassword(hashPassword);
                UserDTO userDTO = this.userService.createUser(request);

                kongService.createConsumer(userDTO.getEmail());
                kongService.createJwtCredential(userDTO.getEmail(), secretKey);

                return ResponseEntity.noContent().build();
        }
}
