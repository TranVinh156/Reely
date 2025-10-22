package com.reely.modules.interaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Builder
public class LikeResponseDTO {
    private Long id;
    private Long videoId;
    private Long userId;
    private Instant createdAt;
}