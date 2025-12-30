package com.reely.modules.search.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.reely.modules.feed.dto.FeedVideoDTO;
import com.reely.modules.feed.entity.Tag;
import com.reely.modules.feed.entity.Video;
import com.reely.modules.feed.mapper.FeedMapper;
import com.reely.modules.feed.repository.TagRepository;
import com.reely.modules.feed.repository.VideoRepository;
import com.reely.modules.interaction.repository.LikeRepository;
import com.reely.modules.search.dto.PageResponse;
import com.reely.modules.search.dto.PublicUserDTO;
import com.reely.modules.search.dto.TagResultDTO;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.repository.UserFollowRepository;
import com.reely.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final VideoRepository videoRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;
    private final LikeRepository likeRepository;
    private final FeedMapper feedMapper;

    @Override
    public PageResponse<FeedVideoDTO> searchVideos(String q, String tag, Pageable pageable, Long viewerId) {
        String qTrim = q == null ? "" : q.trim();
        String tagTrim = tag == null ? null : tag.trim();
        if (tagTrim != null && tagTrim.startsWith("#")) tagTrim = tagTrim.substring(1).trim();

        boolean hasQuery = !qTrim.isEmpty();
        boolean hasTag = tagTrim != null && !tagTrim.isEmpty();

        if (!hasQuery && !hasTag) {
            return new PageResponse<>(pageable.getPageNumber(), pageable.getPageSize(), 0, List.of());
        }

        Pageable noSort = Pageable.ofSize(pageable.getPageSize()).withPage(pageable.getPageNumber());

        Page<Video> page;
        if (hasQuery && hasTag) {
            page = videoRepository.searchPublicVideosByTag(qTrim, tagTrim, noSort);
        } else if (hasTag) {
            page = videoRepository.findPublicVideosByTagName(tagTrim, noSort);
        } else {
            page = videoRepository.searchPublicVideos(qTrim, noSort);
        }

        List<FeedVideoDTO> dtos = page.getContent().stream()
            .map(v -> toFeedDTO(v, viewerId))
            .collect(Collectors.toList());

        return new PageResponse<>(page.getNumber(), page.getSize(), page.getTotalElements(), dtos);
    }


    @Override
    public PageResponse<PublicUserDTO> searchUsers(String q, Pageable pageable) {
        if (q == null || q.trim().isEmpty()) {
            return new PageResponse<>(pageable.getPageNumber(), pageable.getPageSize(), 0, List.of());
        }
        Page<User> page = userRepository.searchUsers(q.trim(), pageable);
        List<PublicUserDTO> dtos = page.getContent().stream().map(PublicUserDTO::from).collect(Collectors.toList());
        return new PageResponse<>(page.getNumber(), page.getSize(), page.getTotalElements(), dtos);
    }

    @Override
    public PageResponse<TagResultDTO> searchTags(String q, Pageable pageable) {
        if (q == null || q.trim().isEmpty()) {
            return new PageResponse<>(pageable.getPageNumber(), pageable.getPageSize(), 0, List.of());
        }

        Page<TagRepository.TagSearchProjection> page = tagRepository.searchTags(q.trim(), pageable);
        List<TagResultDTO> dtos = page.getContent().stream()
                .map(p -> new TagResultDTO(p.getId(), p.getName(), p.getVideoCount()))
                .collect(Collectors.toList());

        return new PageResponse<>(page.getNumber(), page.getSize(), page.getTotalElements(), dtos);
    }

    @Override
    public PageResponse<FeedVideoDTO> getVideosByTag(String tagName, Pageable pageable, Long viewerId) {
        if (tagName == null || tagName.trim().isEmpty()) {
            return new PageResponse<>(pageable.getPageNumber(), pageable.getPageSize(), 0, List.of());
        }

        Pageable noSort = Pageable.ofSize(pageable.getPageSize()).withPage(pageable.getPageNumber());

        Page<Video> page = videoRepository.findPublicVideosByTagName(tagName.trim(), noSort);

        List<FeedVideoDTO> dtos = page.getContent().stream()
            .map(v -> toFeedDTO(v, viewerId))
            .collect(Collectors.toList());

        return new PageResponse<>(page.getNumber(), page.getSize(), page.getTotalElements(), dtos);
    }


    private FeedVideoDTO toFeedDTO(Video video, Long viewerId) {
        User user = userRepository.findById(video.getUserId()).orElse(null);
        FeedVideoDTO dto = feedMapper.toFeedVideoDTO(video, user);

        // tags
        if (video.getTags() != null) {
            dto.setTags(video.getTags().stream().map(Tag::getName).toList());
        }

        if (viewerId != null) {
            dto.setIsLiked(likeRepository.existsByVideoIdAndUserId(video.getId(), viewerId));
            dto.setIsFollowed(userFollowRepository.findByFollowerId(viewerId).stream()
                    .anyMatch(uf -> uf.getFollowing().getId().equals(video.getUserId())));
        }
        return dto;
    }
}
