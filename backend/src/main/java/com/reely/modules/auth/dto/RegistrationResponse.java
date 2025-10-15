package com.reely.modules.auth.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistrationResponse {
    private Long id;
    private String username;
    private String email;
    private Instant createdAt;
}
