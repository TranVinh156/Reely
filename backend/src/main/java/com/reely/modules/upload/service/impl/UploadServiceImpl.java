package com.reely.modules.upload.service.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.reely.modules.upload.dto.PresignedUrlResponse;
import com.reely.modules.upload.service.UploadService;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;

@Service
public class UploadServiceImpl implements UploadService {
    private static final String AVATAR_BUCKET = "avatars";
    private static final String VIDEO_BUCKET = "videos";
    private static final int EXPIRY_TIME = 600;

    private final MinioClient minioClient;

    @Value("${minio.url}")
    private String minioUrl;

    public UploadServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public PresignedUrlResponse getAvatarPresignedUrl(String fileName) {
        return generatePresignedUrl(AVATAR_BUCKET, fileName);
    }

    @Override
    public PresignedUrlResponse getVideoPresignedUrl(String fileName) {
        return generatePresignedUrl(VIDEO_BUCKET, fileName);
    }

    private PresignedUrlResponse generatePresignedUrl(String bucketName, String fileName) {
        String objectName = UUID.randomUUID() + "_" + fileName;
        try {
            String uploadUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(EXPIRY_TIME)
                            .build());

            String fileUrl = String.format("%s/%s", bucketName, objectName);

            return PresignedUrlResponse.builder()
                    .uploadUrl(uploadUrl)
                    .fileUrl(fileUrl)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }
}
