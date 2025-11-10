package com.reely.modules.feed.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name= "users")
@Getter @Setter @Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
//    private String password;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String bio;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;

    public enum Status {
        ACTIVE,
        INACTIVE,
        DELETED
    }
}
