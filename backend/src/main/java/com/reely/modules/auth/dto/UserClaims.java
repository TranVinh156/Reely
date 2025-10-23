package com.reely.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserClaims {
    private Long id;
    private String username;
    private String email;
}
