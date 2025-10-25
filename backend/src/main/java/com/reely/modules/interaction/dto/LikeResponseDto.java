package com.reely.modules.interaction.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class LikeResponseDto {
    private Long id;
    private Long videoId;
    private Long userId;
    private Instant createdAt;
}