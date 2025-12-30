package com.reely.modules.feed.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.reely.modules.feed.entity.Video;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VideoRequestDto {
    private Long userId;
    private String title;
    private String description;
    private Video.Visibility visibility;
    private String originalS3Key;
    private String defaultRenditionId;

    @JsonAlias({"duration"})
    private Integer durationSeconds;

    private List<String> tags;
    
    public enum Visibility {
        PUBLIC,
        PRIVATE,
        FOLLOWERS,
        UNLISTED
    }


}
