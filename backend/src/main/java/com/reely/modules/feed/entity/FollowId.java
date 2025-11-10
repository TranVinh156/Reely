package com.reely.modules.feed.entity;

import lombok.*;
import java.io.Serializable;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FollowId implements Serializable {
    private Long followerId;
    private Long followeeId;
}