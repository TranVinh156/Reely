package com.reely.modules.feed.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long videoId;
    private Long userId;

    private LocalDateTime createdAt;
}
