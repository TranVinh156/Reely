package com.reely.modules.upload.controller;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reely.modules.upload.dto.PresignedUrlResponse;
import com.reely.modules.upload.dto.VideoChunkInitRespone;
import com.reely.modules.upload.dto.VideoChunkCompleteRequest;
import com.reely.modules.upload.dto.VideoChunkCompleteResponse;
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

    /**
     * chunked upload
     */

    @PostMapping("/video/chunk/init")
    public ResponseEntity<VideoChunkInitRespone> initVideoChunkUpload(@RequestParam String fileName) {
        return ResponseEntity.ok(uploadService.initVideoChunkUpload(fileName));
    }

    @PostMapping(value = "/video/chunk", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadVideoChunk(
            @RequestParam String uploadId,
            @RequestParam int partNumber,
            @RequestParam int totalParts,
            @RequestParam("chunk") MultipartFile chunk) {
        uploadService.uploadVideoChunk(uploadId, partNumber, totalParts, chunk);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/video/chunk/complete")
    public ResponseEntity<VideoChunkCompleteResponse> completeVideoChunkUpload(
            @RequestBody VideoChunkCompleteRequest request) {
        return ResponseEntity.ok(uploadService.completeVideoChunkUpload(request));
    }

    @PostMapping("/video/chunk/abort")
    public ResponseEntity<Void> abortVideoChunkUpload(@RequestParam String uploadId) {
        uploadService.abortVideoChunkUpload(uploadId);
        return ResponseEntity.ok().build();
    }
}