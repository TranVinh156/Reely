package com.reely.modules.search.service;

import org.springframework.data.domain.Pageable;

import com.reely.modules.feed.dto.FeedVideoDTO;
import com.reely.modules.search.dto.PageResponse;
import com.reely.modules.search.dto.PublicUserDTO;
import com.reely.modules.search.dto.TagResultDTO;

public interface SearchService {
    PageResponse<FeedVideoDTO> searchVideos(String q, String tag, Pageable pageable, Long viewerId);
    PageResponse<PublicUserDTO> searchUsers(String q, Pageable pageable);
    PageResponse<TagResultDTO> searchTags(String q, Pageable pageable);

    PageResponse<FeedVideoDTO> getVideosByTag(String tagName, Pageable pageable, Long viewerId);
}
