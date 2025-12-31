package com.reely.modules.search.dto;

import com.reely.modules.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User data safe for public search results.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserDTO {
    private Long id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private String bio;

    public static PublicUserDTO from(User u) {
        return new PublicUserDTO(
                u.getId(),
                u.getUsername(),
                u.getDisplayName(),
                u.getAvatarUrl(),
                u.getBio());
    }
}
