package com.reely.modules.feed.controller;

import com.reely.modules.feed.dto.*;
import com.reely.modules.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return feedService.getPublicFeed(pageable);
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
            @AuthenticationPrincipal(expression = "id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return feedService.getTrendingFeed(pageable);
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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return feedService.getUserFeed(userId, pageable);
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
            @AuthenticationPrincipal(expression = "id") Long viewerId) {
        return feedService.getVideoDetail(videoId, viewerId);
    }
}
