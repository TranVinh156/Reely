package com.reely.modules.feed.service;

import com.reely.modules.feed.dto.*;
import org.springframework.data.domain.Pageable;

public interface FeedService {
    FeedResponse getPublicFeed(Pageable pageable, Long viewerId);
    FeedResponse getPersonalizedFeed(Long userId, Pageable pageable);
    FeedResponse getTrendingFeed(Pageable pageable, Long viewerId);
    FeedResponse getUserFeed(Long userId, Pageable pageable, Long viewerId);
    VideoDetailDTO getVideoDetail(Long videoId, Long viewerId);
}