package com.reely.modules.feed.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class CommentDTO {
    private Long commentId;
    private Long userId;
    private String username;
    private String avatarUrl;
    private String text;
    private LocalDateTime createdAt;
}