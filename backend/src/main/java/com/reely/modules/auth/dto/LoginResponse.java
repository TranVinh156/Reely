package com.reely.modules.auth.dto;

import com.reely.modules.user.dto.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;

    private UserDTO userDTO;
}
