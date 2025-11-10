package com.reely.modules.feed.entity;

import jakarta.persistence.*;
import lombok.*;

import java.beans.Visibility;
import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    private String originalS3Key;
    private String defaultRenditionId;
    private Integer durationSeconds;

    private Long viewCount;
    private Long likeCount;
    private Long commentCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Visibility {
        PUBLIC,
        PRIVATE,
        UNLISTED
    }
}
