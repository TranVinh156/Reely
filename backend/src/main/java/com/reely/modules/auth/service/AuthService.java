package com.reely.modules.auth.service;

import com.reely.modules.auth.dto.ChangePasswordRequest;
import com.reely.modules.user.dto.UserDTO;

public interface AuthService {
    String generateAccessToken(String email, UserDTO user);

    String generateRefreshToken(String email, UserDTO user);

    String getCurrentUserEmail();

    void sendForgotPasswordEmail(String email);

    void handleChangePassword(ChangePasswordRequest request);
}
