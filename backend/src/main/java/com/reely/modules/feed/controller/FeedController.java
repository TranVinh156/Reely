package com.reely.modules.feed.controller;

import com.reely.modules.feed.dto.*;
import com.reely.modules.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    /**
     * Public Feed
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/public")
    public FeedResponse getPublicFeed(
            @RequestHeader(value = "X-UserId", required = false) Long viewerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return feedService.getPublicFeed(pageable, viewerId);
    }

    /**
     * Personlized Feed
     * @param userId
     * @param page
     * @param size
     * @return
     */
    @GetMapping
    public FeedResponse getPersonalizedFeed(
            @RequestHeader(value = "X-UserId", required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        // If not logged in, fall back to public feed.
        if (userId == null) {
            return feedService.getPublicFeed(pageable, null);
        }
        return feedService.getPersonalizedFeed(userId, pageable);
    }

    /**
     * Trending Feed
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/trending")
    public FeedResponse getTrendingFeed(
            @RequestHeader(value = "X-UserId", required = false) Long viewerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return feedService.getTrendingFeed(pageable, viewerId);
    }

    /**
     * User Feed
     * @param userId
     * @param page
     * @param size
     * @return
     */
    @GetMapping("/user/{userId}")
    public FeedResponse getUserFeed(
            @PathVariable Long userId,
            @RequestHeader(value = "X-UserId", required = false) Long viewerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return feedService.getUserFeed(userId, pageable, viewerId);
    }

    /**
     * Video Detail
     * @param videoId
     * @param viewerId
     * @return
     */
    @GetMapping("/video/{videoId}")
    public VideoDetailDTO getVideoDetail(
            @PathVariable Long videoId,
            @RequestHeader(value = "X-UserId", required = false) Long viewerId) {
        return feedService.getVideoDetail(videoId, viewerId);
    }

    
}
