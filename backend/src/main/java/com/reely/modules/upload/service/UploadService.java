package com.reely.modules.upload.service;

import com.reely.modules.upload.dto.PresignedUrlResponse;

public interface UploadService {
    PresignedUrlResponse getAvatarPresignedUrl(String fileName);

    PresignedUrlResponse getVideoPresignedUrl(String fileName);

}
