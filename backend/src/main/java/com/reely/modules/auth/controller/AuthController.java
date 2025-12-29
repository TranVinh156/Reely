package com.reely.modules.auth.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reely.modules.auth.dto.ChangePasswordRequest;
import com.reely.modules.auth.dto.ForgotPasswordRequest;
import com.reely.modules.auth.dto.ForgotPasswordResponse;
import com.reely.modules.auth.dto.LoginRequest;
import com.reely.modules.auth.dto.LoginResponse;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.auth.service.AuthService;
import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.service.UserService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
        private final AuthenticationManager authenticationManager;
        private final AuthService authService;
        private final PasswordEncoder passwordEncoder;
        private final UserService userService;

        @Value("${refresh.token.expiration.time}")
        private long refreshTokenExpiration;

        @Value("${jwt.secret}")
        private String secretKey;

        public AuthController(AuthenticationManager authenticationManager,
                        AuthService authService, PasswordEncoder passwordEncoder,
                        UserService userService) {
                this.authenticationManager = authenticationManager;
                this.userService = userService;
                this.authService = authService;
                this.passwordEncoder = passwordEncoder;
        }

        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(), loginRequest.getPassword());
                Authentication authentication = authenticationManager.authenticate(authenticationToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String email = loginRequest.getEmail();
                UserDTO userDTO = this.userService.getUserByEmail(email);

                String accessToken = this.authService.generateAccessToken(userDTO.getEmail(), userDTO);
                String refreshToken = this.authService.generateRefreshToken(userDTO.getEmail(), userDTO);

                userService.updateRefreshToken(userDTO.getId(), refreshToken);
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

        @PostMapping("/refresh")
        public ResponseEntity<LoginResponse> refreshToken(
                        @CookieValue(name = "refresh_token", required = false) String refreshToken) {
                if (refreshToken == null || refreshToken.isEmpty()) {
                        throw new RuntimeException("Refresh token not found.");
                }

                UserDTO userDTO = this.userService.getUserByRefreshToken(refreshToken);

                String accessToken = this.authService.generateAccessToken(userDTO.getEmail(), userDTO);
                String newRefreshToken = this.authService.generateRefreshToken(userDTO.getEmail(), userDTO);

                this.userService.updateRefreshToken(userDTO.getId(), newRefreshToken);

                LoginResponse response = new LoginResponse(accessToken, userDTO);

                ResponseCookie cookies = ResponseCookie
                                .from("refresh_token", newRefreshToken)
                                .path("/")
                                .maxAge(refreshTokenExpiration)
                                .secure(true)
                                .httpOnly(true)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookies.toString())
                                .body(response);
        }

        @PostMapping("/logout")
        public ResponseEntity<Void> logout() {
                ResponseCookie clearCookie = ResponseCookie
                                .from("refresh_token", "")
                                .path("/")
                                .maxAge(0)
                                .secure(true)
                                .httpOnly(true)
                                .build();

                return ResponseEntity.noContent()
                                .header(HttpHeaders.SET_COOKIE, clearCookie.toString()).build();
        }

        @PostMapping("/change-password")
        public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest request) {
                this.authService.handleChangePassword(request);
                return ResponseEntity.noContent().build();
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
                return ResponseEntity.noContent().build();
        }

        @PostMapping("/register")
        public ResponseEntity<UserDTO> register(@RequestBody RegistrationRequest request) {
                String hashPassword = this.passwordEncoder.encode(request.getPassword());
                request.setPassword(hashPassword);
                UserDTO userDTO = this.userService.createUser(request);
                return ResponseEntity.ok(userDTO);
        }

        @GetMapping("/me")
        public ResponseEntity<UserDTO> getCurrentUserLogin() {
                String email = this.authService.getCurrentUserEmail();
                UserDTO userDTO = this.userService.getUserByEmail(email);
                return ResponseEntity.ok(userDTO);
        }

        @PostMapping("/change-password")
        public String changePassword(@RequestBody ChangePasswordRequest request) {
                this.authService.handleChangePassword(request);
                return "OK";
        }

}
