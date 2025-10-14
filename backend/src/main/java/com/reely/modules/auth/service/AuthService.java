package com.reely.modules.auth.service;

import org.springframework.security.oauth2.jwt.Jwt;

import com.reely.modules.auth.dto.UserDTO;

public interface AuthService {
    String generateAccessToken(String email, String secret, String iss, UserDTO user);

    String generateRefreshToken(String email, UserDTO user);

    Jwt checkValidRefreshToken(String refreshToken);

}
