package com.reely.modules.user.service.impl;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reely.config.RabbitMQConfig;
import com.reely.modules.feed.entity.Video;
import com.reely.modules.interaction.entity.Likes;
import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.enums.NotificationType;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.reely.modules.user.dto.UserDTO;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.entity.UserFollow;
import com.reely.modules.user.repository.UserFollowRepository;
import com.reely.modules.user.repository.UserRepository;
import com.reely.modules.user.service.UserFollowService;

import jakarta.transaction.Transactional;

@Service
public class UserFollowImpl implements UserFollowService {
    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;
    private final RabbitTemplate rabbitTemplate;


    public UserFollowImpl(UserRepository userRepository, UserFollowRepository userFollowRepository, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.userFollowRepository = userFollowRepository;
        this.rabbitTemplate =  rabbitTemplate;
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
        publisherFollowNotification(userFollow, follower, following);
    }

    @Override
    @Transactional
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

    @Override
    public long getFollowersCount(long userId) {
        return this.userFollowRepository.countByFollowingId(userId);
    }

    @Override
    public long getFollowingCount(long userId) {
        return this.userFollowRepository.countByFollowerId(userId);
    }

    @Override
    public boolean isFollowing(long followerId, long followingId) {
        return this.userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    private void publisherFollowNotification(UserFollow UserFollow, User follower, User following) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            String content = "đã follow bạn";
            Map<String, Object> payloadMap = Map.of(
                    "actorId", follower.getId(),
                    "actorUsername", follower.getUsername(),
                    "actorAvatar", follower.getAvatarUrl(),
                    "message", content
            );

            String payload = objectMapper.writeValueAsString(payloadMap);

            NotificationRequestDto notificationRequestDto = NotificationRequestDto.builder()
                    .userId(following.getId())
                    .type(NotificationType.FOLLOW)
                    .payload(payload)
                    .readFlag(0)
                    .build();

            rabbitTemplate.convertAndSend(RabbitMQConfig.FOLLOW_EXCHANGE, RabbitMQConfig.FOLLOW_ROUTING_KEY, notificationRequestDto);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

}
