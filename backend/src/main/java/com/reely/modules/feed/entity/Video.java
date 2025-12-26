package com.reely.modules.feed.entity;

import com.reely.modules.feed.dto.VideoRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.beans.Visibility;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name= "videos")
@Getter @Setter @Builder
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

    @Column(columnDefinition = "TEXT")
    private String originalS3Key;
    private String defaultRenditionId;
    private Integer durationSeconds;

    private Long viewCount;
    private Long likeCount;
    private Long commentCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Video(VideoRequestDto videoRequestDto) {
        this.userId = videoRequestDto.getUserId();
        this.title = videoRequestDto.getTitle();
        this.description = videoRequestDto.getDescription();
        this.visibility = videoRequestDto.getVisibility();
        this.originalS3Key = videoRequestDto.getOriginalS3Key();
        this.defaultRenditionId = videoRequestDto.getDefaultRenditionId();
        this.durationSeconds = videoRequestDto.getDurationSeconds();
        this.viewCount = 0L;
        this.likeCount = 0L;
        this.commentCount = 0L;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public enum Visibility {
        PUBLIC,
        PRIVATE,
        UNLISTED
    }
}
