package com.reely.modules.feed.service;

import com.reely.modules.feed.dto.*;
import com.reely.modules.feed.entity.*;
import com.reely.modules.feed.mapper.FeedMapper;
import com.reely.modules.feed.repository.*;
import com.reely.modules.interaction.repository.CommentRepository;
import com.reely.modules.interaction.repository.LikeRepository;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.repository.UserFollowRepository;
import com.reely.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FeedMapper feedMapper;
    /**
     * Public Feed
     * 
     * @param pageable
     * @return
     */
    @Override
    public FeedResponse getPublicFeed(Pageable pageable, Long viewerId) {
        Page<Video> page = videoRepository.findPublicFeed(pageable);
        List<FeedVideoDTO> content = mapVideosToDTO(page.getContent(), viewerId);
        return buildFeedResponse(page, content);
    }

    /**
     * Personalized Feed
     * 
     * @param userId
     * @param pageable
     * @return
     */
    @Override
    public FeedResponse getPersonalizedFeed(Long userId, Pageable pageable) {
        List<Long> followeeIds = userFollowRepository.findByFollowerId(userId)
                .stream()
                .map(userFollow -> userFollow.getFollowing().getId())
                .collect(Collectors.toList());
        if (followeeIds.isEmpty())
            return getPublicFeed(pageable, userId);

        Page<Video> page = videoRepository.findFeedForUser(followeeIds, pageable);
        List<FeedVideoDTO> content = mapVideosToDTO(page.getContent(), userId);
        return buildFeedResponse(page, content);
    }

    /**
     * Trending Feed
     * 
     * @param pageable
     * @return
     */
    @Override
    public FeedResponse getTrendingFeed(Pageable pageable, Long viewerId) {
        Page<Video> page = videoRepository.findTrendingFeed(pageable);
        List<FeedVideoDTO> content = mapVideosToDTO(page.getContent(), viewerId);
        return buildFeedResponse(page, content);
    }

    /**
     * User Feed
     * 
     * @param userId
     * @param pageable
     * @return
     */
    @Override
    public FeedResponse getUserFeed(Long userId, Pageable pageable, Long viewerId) {
        Page<Video> page = videoRepository.findByUserId(userId, pageable);
        List<FeedVideoDTO> content = mapVideosToDTO(page.getContent(), viewerId);
        return buildFeedResponse(page, content);
    }

    /**
     * Video Detail
     * 
     * @param videoId
     * @param viewerId
     * @return
     */
    @Override
    public VideoDetailDTO getVideoDetail(Long videoId, Long viewerId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        User user = userRepository.findById(video.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // List<Comment> comments =
        // commentRepository.findByVideoIdOrderByCreatedAtAsc(videoId);
        // List<CommentDTO> commentDTOs = comments.stream()
        // .map(c -> CommentDTO.builder()
        // .commentId(c.getId())
        // .userId(c.getUserId())
        // .text(c.getText())
        // .createdAt(c.getCreatedAt())
        // .build())
        // .collect(Collectors.toList());

        return VideoDetailDTO.builder()
                .videoId(video.getId())
                .userId(video.getUserId())
                .title(video.getTitle())
                .description(video.getDescription())
                .videoUrl("https://s3.reely.vn/videos/" + video.getOriginalS3Key())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .viewCount(video.getViewCount())
                .likeCount(video.getLikeCount())
                .commentCount(video.getCommentCount())
                .createdAt(video.getCreatedAt())
                // .comments(commentDTOs)
                .build();
    }

    /**
     * Utility mapping methods
     * 
     * @param videos
     * @param viewerId
     * @return
     */
    private List<FeedVideoDTO> mapVideosToDTO(List<Video> videos, Long viewerId) {
        return videos.stream().map(video -> {
            User user = userRepository.findById(video.getUserId()).orElse(null);
            FeedVideoDTO dto = feedMapper.toFeedVideoDTO(video, user);

            if (viewerId != null) {
                dto.setIsLiked(likeRepository.existsByVideoIdAndUserId(video.getId(), viewerId));
                dto.setIsFollowed(userFollowRepository.findByFollowingId(viewerId).stream()
                        .anyMatch(uf -> uf.getFollowing().getId().equals(video.getUserId())));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    private FeedResponse buildFeedResponse(Page<Video> page, List<FeedVideoDTO> content) {
        return FeedResponse.builder()
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .content(content)
                .build();
    }
}
