package com.reely.modules.user.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;

    private String displayName;

    private String bio;
}
