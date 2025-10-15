package com.reely.modules.auth.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reely.gateway.KongService;
import com.reely.modules.auth.dto.RegistrationRequest;
import com.reely.modules.auth.dto.UserDTO;
import com.reely.modules.auth.service.AuthService;

import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class AuthController {
        private final AuthenticationManagerBuilder authenticationManagerBuilder;
        // private final UserService userService;
        private final AuthService authService;
        private final PasswordEncoder passwordEncoder;
        private final KongService kongService;

        @Value("${refresh.token.expiration.time}")
        private long refreshTokenExpiration;

        public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder,
                        AuthService authService, PasswordEncoder passwordEncoder, KongService kongService) {
                this.authenticationManagerBuilder = authenticationManagerBuilder;
                // this.userService = userService;
                this.authService = authService;
                this.passwordEncoder = passwordEncoder;
                this.kongService = kongService;
        }

        // @PostMapping("/login")
        // public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest
        // loginRequest) {
        // UsernamePasswordAuthenticationToken authenticationToken = new
        // UsernamePasswordAuthenticationToken(
        // loginRequest.getUsername(), loginRequest.getPassword());

        // Authentication authentication = authenticationManagerBuilder.getObject()
        // .authenticate(authenticationToken);
        // SecurityContextHolder.getContext().setAuthentication(authentication);

        // String email = loginRequest.getUsername();
        // User user = this.userService.getUserByEmail(email);
        // UserDTO userDTO = new UserDTO(user);

        // String accessToken = this.authService.generateAccessToken(email, email,
        // email, userDTO);
        // String refreshToken = this.authService.generateRefreshToken(email, userDTO);

        // LoginResponse response = new LoginResponse(accessToken, userDTO);

        // ResponseCookie cookies = ResponseCookie
        // .from("refresh_token", refreshToken)
        // .path("/")
        // .maxAge(refreshTokenExpiration)
        // .secure(true)
        // .httpOnly(true)
        // .build();

        // return ResponseEntity.ok()
        // .header(HttpHeaders.SET_COOKIE, cookies.toString())
        // .body(response);
        // }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegistrationRequest user) {
                String hashPassword = this.passwordEncoder.encode(user.getPassword());
                System.out.println("Password hash: " + hashPassword);
                kongService.createConsumer(user.getEmail());
                Map<String, Object> jwtCredential = kongService.createJwtCredential(user.getEmail());
                UserDTO userDTO = new UserDTO();
                userDTO.setId(new Long(1));
                userDTO.setUsername("MQuang");
                userDTO.setEmail(user.getEmail());
                userDTO.setCreatedAt(Instant.now());
                userDTO.setUpdatedAt(Instant.now());
                String secretKey = (String) jwtCredential.get("secret");
                String key = (String) jwtCredential.get("key");
                String accessToken = this.authService.generateAccessToken(user.getEmail(),
                                secretKey,
                                key, userDTO);
                System.out.println(secretKey);
                System.out.println(key);
                System.out.println(accessToken);
                return ResponseEntity.ok(accessToken);
        }
}
