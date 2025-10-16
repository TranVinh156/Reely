package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.LikeRequestDTO;
import com.reely.modules.interaction.dto.LikeResponseDTO;
import com.reely.modules.interaction.entity.Like;
import com.reely.modules.interaction.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService{
    private final LikeRepository likeRepository;
    private final UserService userService;
    private final VideoService videoService;

    @Autowired
    public LikeServiceImpl(LikeRepository likeRepository, UserService userService, VideoService videoService) {
        this.likeRepository = likeRepository;
        this.userService = userService;
        this.videoService = videoService;
    }

    public Like addLike(LikeRequestDTO likeRequestDTO) {
        User user = userService.getUserById(likeRequestDTO.getUserId());
        Video video = videoService.getVideoById(likeRequestDTO.getVideoId());

        if(likeRepository.findByVideoIdAndUserId(likeRequestDTO.getUserId(),  likeRequestDTO.getVideoId()).isPresent()){
            throw new RuntimeException(); // tạm
        }

        return likeRepository.save(
                Like.builder()
                .user(user)
                .video(video)
                .build()
        );
    }

    public List<LikeResponseDTO> getLikeByVideoId(Long videoId) {
        return  likeRepository.findAllByVideoId(videoId)
                .stream()
                .map(like -> LikeResponseDTO.builder()
                        .id(like.getId())
                        .userId(like.getUser().getId())
                        .videoId(like.getVideo().getId())
                        .createdAt(like.getCreatAt())
                        .build()
                );
    }

    public List<LikeResponseDTO> getLikeByUserId(Long userId) {
        return  likeRepository.findAllByVideoId(userId)
                .stream()
                .map(like -> LikeResponseDTO.builder()
                        .id(like.getId())
                        .userId(like.getUser().getId())
                        .videoId(like.getVideo().getId())
                        .createdAt(like.getCreatAt())
                        .build()
                );
    }

    public LikeResponseDTO getLikeByVideoIdAndUserId(Long videoId, Long userId) {
        Optional<Like> like = likeRepository.findByVideoIdAndUserId(videoId, userId);
        if(like.isEmpty()){
            throw new RuntimeException();
        }

        return LikeResponseDTO.builder()
                .id(like.get().getId())
                .userId(userId)
                .videoId(videoId)
                .createdAt(like.get().getCreatAt())
                .build();
    }

    public Like getLikeById(Long likeId) {
        return  likeRepository.findById(likeId).orElseThrow(() -> new RuntimeException("Like not found!"));
    }

    public void deleteLike(long likeId) {
        likeRepository.deleteById(likeId);
    }


}
