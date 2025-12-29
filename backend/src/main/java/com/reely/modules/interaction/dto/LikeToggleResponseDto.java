package com.reely.modules.interaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeToggleResponseDto {
    private Long videoId;
    private Boolean liked;
    private Long likeCount;
}
