package com.reely.modules.feed.service;

import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.entity.Video;

public interface VideoService {
    Video addVideo(VideoRequestDto videoRequestDto);
    String createPresignedUploadUrl(String filename);
}
