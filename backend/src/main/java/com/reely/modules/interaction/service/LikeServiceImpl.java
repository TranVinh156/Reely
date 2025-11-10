package com.reely.modules.interaction.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reely.config.RabbitMQConfig;
import com.reely.modules.interaction.dto.LikeRequestDto;
import com.reely.modules.interaction.dto.LikeResponseDto;
import com.reely.modules.interaction.entity.Likes;
import com.reely.modules.interaction.repository.LikeRepository;
import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.entity.Notification;
import com.reely.modules.notification.enums.NotificationType;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.repository.UserRepository;
import com.reely.modules.user.service.UserService;
import com.reely.modules.video.VideoRepository;
import com.reely.modules.video.entity.Video;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService{
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public LikeServiceImpl(LikeRepository likeRepository, UserRepository userRepository, VideoRepository videoRepository, RabbitTemplate rabbitTemplate) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.rabbitTemplate =  rabbitTemplate;
    }

    public Likes addLike(LikeRequestDto likeRequestDTO) {
        Optional<User> user = userRepository.findById(likeRequestDTO.getUserId());
        Optional<Video> video = videoRepository.findById(likeRequestDTO.getVideoId());

        if(likeRepository.findByVideoIdAndUserId(likeRequestDTO.getVideoId(), likeRequestDTO.getUserId()).isPresent()){
            throw new RuntimeException(); // tạm
        }

        if(user.isPresent() && video.isPresent()){


            Likes like =  likeRepository.save(
                    Likes.builder()
                            .user(user.get())
                            .video(video.get())
                            .build()
            );
            if (!user.get().getId().equals(video.get().getUserId())) {
                publisherLikeNotification(like, user.get(), video.get());
            }

            return like;
        } else {
            throw new RuntimeException();
        }
    }

    public List<LikeResponseDto> getLikeByVideoId(Long videoId) {
        return  likeRepository.findAllByVideoId(videoId)
                .stream()
                .map(like -> LikeResponseDto.builder()
                        .id(like.getId())
                        .userId(like.getUser().getId())
                        .videoId(like.getVideo().getId())
                        .createdAt(like.getCreatedAt())
                        .build()
                ).toList();
    }

    public List<LikeResponseDto> getLikeByUserId(Long userId) {
        return  likeRepository.findAllByUserId(userId)
                .stream()
                .map(like -> LikeResponseDto.builder()
                        .id(like.getId())
                        .userId(like.getUser().getId())
                        .videoId(like.getVideo().getId())
                        .createdAt(like.getCreatedAt())
                        .build()
                ).toList();
    }

    public LikeResponseDto getLikeByVideoIdAndUserId(Long videoId, Long userId) {
        Optional<Likes> like = likeRepository.findByVideoIdAndUserId(videoId, userId);
        if(like.isEmpty()){
            throw new RuntimeException();
        }

        return LikeResponseDto.builder()
                .id(like.get().getId())
                .userId(userId)
                .videoId(videoId)
                .createdAt(like.get().getCreatedAt())
                .build();
    }

    public Likes getLikeById(Long likeId) {
        return  likeRepository.findById(likeId).orElseThrow(() -> new RuntimeException("Like not found!"));
    }

    public void deleteLike(long likeId) {
        likeRepository.deleteById(likeId);
    }

    private void publisherLikeNotification(Likes like, User user, Video video) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            String content = "đã thích video của bạn";
            Map<String, Object> payloadMap = Map.of(
                    "actorId", user.getId(),
                    "actorUsername", user.getUsername(),
                    "actorAvatar", user.getAvatarUrl(),
                    "message", content,
                    "videoId", video.getId(),
                    "LikeId", like.getId()
            );

            String payload = objectMapper.writeValueAsString(payloadMap);

            NotificationRequestDto notificationRequestDto = NotificationRequestDto.builder()
                    .userId(video.getUserId())
                    .type(NotificationType.LIKE)
                    .payload(payload)
                    .readFlag(0)
                    .build();

            rabbitTemplate.convertAndSend(RabbitMQConfig.COMMENT_EXCHANGE, RabbitMQConfig.COMMENT_ROUTING_KEY, notificationRequestDto);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }


}
