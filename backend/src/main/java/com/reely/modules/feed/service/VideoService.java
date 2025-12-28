package com.reely.modules.feed.service;

import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.entity.Video;

import com.reely.modules.auth.dto.PaginationResponse;

public interface VideoService {
    Video addVideo(VideoRequestDto videoRequestDto);

    String createPresignedUploadUrl(String filename);

    PaginationResponse<Video> getVideosByUserId(Long userId, int page, int size);

    Long getTotalViewsByUserId(Long userId);

    Long getTotalCommentsByUserId(Long userId);

    Long getTotalLikesByUserId(Long userId);
}
