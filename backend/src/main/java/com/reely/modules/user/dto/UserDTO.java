package com.reely.modules.user.dto;

import java.time.Instant;

import com.reely.modules.user.entity.Role;
import com.reely.modules.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    private String username;

    private String email;

    private String displayName;

    private String bio;

    private String avatarUrl;

    private Role role;

    private Instant createdAt;

    private Instant updatedAt;

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.displayName = user.getDisplayName();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.role = user.getRole();
    }
}
