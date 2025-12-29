package com.reely.modules.upload.service;

import org.springframework.web.multipart.MultipartFile;

import com.reely.modules.feed.entity.Video;
import com.reely.modules.upload.dto.PresignedUrlResponse;
import com.reely.modules.upload.dto.VideoChunkCompleteRequest;
import com.reely.modules.upload.dto.VideoChunkCompleteResponse;
import com.reely.modules.upload.dto.VideoChunkInitRespone;

public interface UploadService {
    PresignedUrlResponse getAvatarPresignedUrl(String fileName);

    PresignedUrlResponse getVideoPresignedUrl(String fileName);

    /**
     * chunked upload
     */
    VideoChunkInitRespone initVideoChunkUpload(String originalFileName);

    void uploadVideoChunk(String uploadId, int partNumber, int totalParts, MultipartFile chunk);

    VideoChunkCompleteResponse completeVideoChunkUpload(VideoChunkCompleteRequest request);

    void abortVideoChunkUpload(String uploadId);

}
