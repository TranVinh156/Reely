package com.reely.modules.feed.entity;

import com.reely.modules.feed.dto.VideoRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.beans.Visibility;
import java.time.Instant;
import java.time.LocalDateTime;

import java.util.HashSet;
import java.util.Set;

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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "video_tags",
        joinColumns = @JoinColumn(name = "video_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id"),
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_video_tags", columnNames = {"video_id", "tag_id"})
        }
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

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
        FOLLOWERS,
        UNLISTED
    }
}
