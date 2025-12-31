package com.reely.modules.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoViewResponseDto {
    private Long videoId;
    private Long viewCount;
}
