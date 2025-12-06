package com.reely.modules.upload.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reely.modules.upload.dto.PresignedUrlResponse;
import com.reely.modules.upload.service.UploadService;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {
    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @GetMapping("/avatar")
    public ResponseEntity<PresignedUrlResponse> getAvatarPresignedUrl(@RequestParam String fileName) {
        return ResponseEntity.ok(uploadService.getAvatarPresignedUrl(fileName));
    }

    @GetMapping("/video")
    public ResponseEntity<PresignedUrlResponse> getVideoPresignedUrl(@RequestParam String fileName) {
        return ResponseEntity.ok(uploadService.getVideoPresignedUrl(fileName));
    }
}
