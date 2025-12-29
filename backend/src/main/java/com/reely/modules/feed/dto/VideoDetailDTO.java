package com.reely.modules.feed.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class VideoDetailDTO {
    private Long videoId;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private String username;
    private String avatarUrl;

    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    private Integer durationSeconds;
    private List<String> tags;
    private LocalDateTime createdAt;

    private List<CommentDTO> comments;
}
