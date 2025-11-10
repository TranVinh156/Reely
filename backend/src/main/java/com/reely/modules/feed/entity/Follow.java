package com.reely.modules.feed.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "follows")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@IdClass(FollowId.class)
public class Follow {

    @Id
    private Long followerId;

    @Id
    private Long followeeId;

    private LocalDateTime createdAt;
}