package com.reely.modules.feed.service;

import com.reely.modules.feed.dto.*;
import org.springframework.data.domain.Pageable;

public interface FeedService {
    FeedResponse getPublicFeed(Pageable pageable);
    FeedResponse getPersonalizedFeed(Long userId, Pageable pageable);
    FeedResponse getTrendingFeed(Pageable pageable);
    FeedResponse getUserFeed(Long userId, Pageable pageable);
    VideoDetailDTO getVideoDetail(Long videoId, Long viewerId);
}