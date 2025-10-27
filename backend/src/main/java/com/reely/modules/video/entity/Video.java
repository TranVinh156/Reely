package com.reely.modules.video.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "videos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    @Column(name = "original_s3_key")
    private String originalS3Key;

    @Column(name = "default_rendition_id")
    private Long defaultRenditionId;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "view_count")
    private Long viewCount;

    @Column(name = "like_count")
    private Long likeCount;

    @Column(name = "comment_count")
    private Long commentCount;

    private Instant created_at;
    private Instant updated_at;
    private Instant deleted_at;

    @PrePersist
    public void prePersist() {
        created_at = Instant.now();
        updated_at = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updated_at = Instant.now();
    }

    public enum Visibility {
        PUBLIC, PRIVATE, UNLISTED
    }
}
