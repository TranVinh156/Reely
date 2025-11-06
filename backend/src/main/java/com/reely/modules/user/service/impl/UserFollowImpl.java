package com.reely.modules.user.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.entity.UserFollow;
import com.reely.modules.user.repository.UserFollowRepository;
import com.reely.modules.user.repository.UserRepository;
import com.reely.modules.user.service.UserFollowService;

@Service
public class UserFollowImpl implements UserFollowService {
    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;

    public UserFollowImpl(UserRepository userRepository, UserFollowRepository userFollowRepository) {
        this.userRepository = userRepository;
        this.userFollowRepository = userFollowRepository;
    }

    @Override
    public void followUser(long followerId, long followingId) {
        User follower = this.userRepository.findById(followerId).get();
        User following = this.userRepository.findById(followingId).get();

        UserFollow userFollow = UserFollow.builder()
                .follower(follower)
                .following(following)
                .build();
        userFollowRepository.save(userFollow);
    }

    @Override
    public void unfollowUser(long followerId, long followingId) {
        userFollowRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public List<UserDTO> getFollowers(long userId) {
        return this.userFollowRepository
                .findByFollowingId(userId)
                .stream()
                .map(UserFollow::getFollower)
                .map(UserDTO::new)
                .toList();
    }

    @Override
    public List<UserDTO> getFollowing(long userId) {
        return this.userFollowRepository
                .findByFollowerId(userId)
                .stream()
                .map(UserFollow::getFollowing)
                .map(UserDTO::new)
                .toList();
    }
}
