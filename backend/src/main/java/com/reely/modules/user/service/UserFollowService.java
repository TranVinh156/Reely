package com.reely.modules.user.service;

import java.util.List;

import com.reely.modules.user.dto.UserDTO;

public interface UserFollowService {
    void followUser(long followerId, long followingId);

    void unfollowUser(long followerId, long followingId);

    List<UserDTO> getFollowers(long userId);

    List<UserDTO> getFollowing(long userId);

    long getFollowersCount(long userId);

    long getFollowingCount(long userId);

    boolean isFollowing(long followerId, long followingId);

}
