package com.reely.modules.feed.controller;

import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.entity.Video;
import com.reely.modules.feed.service.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/videos")
public class VideoController {

    private final VideoService videoService;

    public  VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("")
    public ResponseEntity<Video> addVideo(@RequestBody VideoRequestDto videoRequestDto){
        return ResponseEntity.ok(videoService.addVideo(videoRequestDto));
    }

    @PostMapping("/presigned-url")
    public ResponseEntity<String> getPresignedUrl(@RequestParam String videoname){
        return ResponseEntity.ok(videoService.createPresignedUploadUrl(videoname));
    }
}
