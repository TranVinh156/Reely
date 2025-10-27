package com.reely.modules.user.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;

    private String email;

    private String displayName;

    private String bio;

    private String avatarUrl;
}
