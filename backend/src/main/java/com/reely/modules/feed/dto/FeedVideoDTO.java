package com.reely.modules.feed.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class FeedVideoDTO {
    private Long videoId;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;

    private Long userId;
    private String username;
    private String avatarUrl;

    private Long likeCount;
    private Long commentCount;
    private Long viewCount;

    private Boolean isLiked;
    private Boolean isFollowed;

    private LocalDateTime createdAt;
}
