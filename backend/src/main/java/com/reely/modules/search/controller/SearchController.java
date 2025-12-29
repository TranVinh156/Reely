package com.reely.modules.search.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reely.modules.feed.dto.FeedVideoDTO;
import com.reely.modules.search.dto.PageResponse;
import com.reely.modules.search.dto.PublicUserDTO;
import com.reely.modules.search.dto.TagResultDTO;
import com.reely.modules.search.service.SearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search/videos")
    public PageResponse<FeedVideoDTO> searchVideos(
            @RequestParam(name = "q", defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "X-UserId", required = false) Long viewerId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return searchService.searchVideos(q, pageable, viewerId);
    }

    @GetMapping("/search/users")
    public PageResponse<PublicUserDTO> searchUsers(
            @RequestParam(name = "q", defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return searchService.searchUsers(q, pageable);
    }

    @GetMapping("/search/tags")
    public PageResponse<TagResultDTO> searchTags(
            @RequestParam(name = "q", defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return searchService.searchTags(q, pageable);
    }

    @GetMapping("/tags/{tagName}/videos")
    public PageResponse<FeedVideoDTO> videosByTag(
            @PathVariable String tagName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "X-UserId", required = false) Long viewerId) {
        Pageable pageable = PageRequest.of(page, size);
        return searchService.getVideosByTag(tagName, pageable, viewerId);
    }
}
