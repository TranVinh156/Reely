package com.reely.modules.interaction.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LikeRequestDto {
    private Long videoId;
    private Long userId;

}