package com.reely.modules.interaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
public class LikeRequestDTO {
    private Long videoId;
    private Long userId;

}