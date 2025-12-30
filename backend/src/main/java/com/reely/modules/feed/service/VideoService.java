package com.reely.modules.feed.service;

import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.dto.VideoResponseDto;
import com.reely.modules.feed.dto.VideoViewResponseDto;
import com.reely.modules.feed.dto.ViewStat;
import com.reely.modules.feed.entity.Video;

import com.reely.modules.auth.dto.PaginationResponse;
import com.reely.modules.interaction.dto.LikeStat;

import java.util.List;

public interface VideoService {
    Video addVideo(VideoRequestDto videoRequestDto);

    String createPresignedUploadUrl(String filename);

    PaginationResponse<Video> getVideosByUserId(Long userId, int page, int size);

    Long getTotalViewsByUserId(Long userId);

    Long getTotalCommentsByUserId(Long userId);

    Long getTotalLikesByUserId(Long userId);

    List<ViewStat> countViewsByUserIdAndDate(Long userId, Long days);
    
    VideoViewResponseDto incrementView(Long videoId);

    List<VideoResponseDto> getTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    void deleteVideo(Long videoId, Long userId);

}
