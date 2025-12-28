package com.reely.modules.upload.service.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.reely.modules.feed.entity.Video;
import com.reely.modules.upload.dto.PresignedUrlResponse;
import com.reely.modules.upload.dto.VideoChunkCompleteRequest;
import com.reely.modules.upload.dto.VideoChunkCompleteResponse;
import com.reely.modules.upload.dto.VideoChunkInitRespone;
import com.reely.modules.upload.service.UploadService;

import io.minio.ComposeObjectArgs;
import io.minio.ComposeSource;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.ListObjectsArgs;
import io.minio.Result;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import io.minio.messages.Item;

import java.util.ArrayList;
import java.util.List;

@Service
public class UploadServiceImpl implements UploadService {
    private static final String AVATAR_BUCKET = "avatars";
    private static final String VIDEO_BUCKET = "videos";
    private static final int EXPIRY_TIME = 600;
    private static final long DEFAULT_CHUNK_SIZE = 5L * 1024 * 1024;

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

    /**
     * chunked upload
     */

    @Override
    public VideoChunkInitRespone initVideoChunkUpload(String fileName) {
        String uploadId = UUID.randomUUID().toString();
        String objectName = UUID.randomUUID() + "_" + fileName;

        return VideoChunkInitRespone.builder()
                .uploadId(uploadId)
                .objectName(objectName)
                .fileUrl("/" + VIDEO_BUCKET + "/" + objectName)
                .chunkSize(DEFAULT_CHUNK_SIZE) // 5 MB
                .build();
    }

    @Override
    public void uploadVideoChunk(String uploadId, int partNumber, int totalParts, MultipartFile chunk) {
        if (partNumber <= 0 || totalParts <= 0 || partNumber > totalParts) {
            throw new IllegalArgumentException("Invalid part number");
        }

        if (chunk == null || chunk.isEmpty()) {
            throw new IllegalArgumentException("Chunk cannot be null or empty");
        }
        
        String chunkObjectKey = chunkObjectKey(uploadId, partNumber);
        
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(VIDEO_BUCKET)
                            .object(chunkObjectKey)
                            .stream(chunk.getInputStream(), chunk.getSize(), -1)
                            .contentType("application/octet-stream")
                            .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload video chunk", e);
        }
    }

    @Override
    public VideoChunkCompleteResponse completeVideoChunkUpload(VideoChunkCompleteRequest request) {
        if (request == null || request.getUploadId() == null || request.getObjectName() == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        if (request.getTotalParts() <= 0) {
            throw new IllegalArgumentException("Total parts must be greater than zero");
        }

        String uploadId = request.getUploadId();
        String objectName = request.getObjectName();
        int totalParts = request.getTotalParts();

        List<ComposeSource> sources = new ArrayList<>(totalParts);
        for (int i = 1; i <= totalParts; i++) {
            sources.add(ComposeSource.builder()
                    .bucket(VIDEO_BUCKET)
                    .object(chunkObjectKey(uploadId, i))
                    .build());
        }

        try {
            minioClient.composeObject(
                    io.minio.ComposeObjectArgs.builder()
                            .bucket(VIDEO_BUCKET)
                            .object(objectName)
                            .sources(sources)
                            .build());

            // Cleanup chunk objects
            for (int i = 1; i <= totalParts; i++) {
                minioClient.removeObject(
                        io.minio.RemoveObjectArgs.builder()
                                .bucket(VIDEO_BUCKET)
                                .object(chunkObjectKey(uploadId, i))
                                .build());
            }

            return VideoChunkCompleteResponse.builder()
                    .fileUrl("/" + VIDEO_BUCKET + "/" + objectName)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to complete chunked upload", e);
        }
    }

    @Override
    public void abortVideoChunkUpload(String uploadId) {
        String prefix = "multipart/" + uploadId + "/";
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(
                    io.minio.ListObjectsArgs.builder()
                            .bucket(VIDEO_BUCKET)
                            .prefix(prefix)
                            .recursive(true)
                            .build());

            for (Result<Item> result : results) {
                io.minio.messages.Item item = result.get();
                minioClient.removeObject(
                        io.minio.RemoveObjectArgs.builder()
                                .bucket(VIDEO_BUCKET)
                                .object(item.objectName())
                                .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to abort chunked upload", e);
        }
    }

    private String chunkObjectKey(String uploadId, int partNumber) {
        return "multipart/" + uploadId + "/part_" + partNumber;
    }
}
