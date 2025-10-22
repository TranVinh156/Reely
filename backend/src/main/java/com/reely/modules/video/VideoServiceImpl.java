package com.reely.modules.video;

import com.reely.modules.video.entity.Video;
import com.reely.modules.video.VideoRepository;
import org.springframework.stereotype.Service;

@Service
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;

    public VideoServiceImpl(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @Override
    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
    }
}
