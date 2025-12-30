package com.reely.modules.upload.service.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.reely.modules.upload.dto.PresignedUrlResponse;
import com.reely.modules.upload.dto.VideoChunkCompleteRequest;
import com.reely.modules.upload.dto.VideoChunkCompleteResponse;
import com.reely.modules.upload.dto.VideoChunkInitRespone;
import com.reely.modules.upload.service.UploadService;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class UploadServiceImpl implements UploadService {
    private static final int EXPIRY_TIME = 10; // Minutes
    private static final long DEFAULT_CHUNK_SIZE = 5L * 1024 * 1024;

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public UploadServiceImpl(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    @Override
    public PresignedUrlResponse getAvatarPresignedUrl(String fileName) {
        return generatePresignedUrl(bucketName, "avatars/" + fileName);
    }

    @Override
    public PresignedUrlResponse getVideoPresignedUrl(String fileName) {
        return generatePresignedUrl(bucketName, "videos/" + fileName);
    }

    private PresignedUrlResponse generatePresignedUrl(String bucketName, String objectName) {
        String finalObjectName = UUID.randomUUID() + "_" + objectName;
        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(finalObjectName)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(EXPIRY_TIME))
                    .putObjectRequest(objectRequest)
                    .build();

            String uploadUrl = s3Presigner.presignPutObject(presignRequest).url().toString();

            String fileUrl = finalObjectName;

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
        String objectName = "videos/" + UUID.randomUUID() + "_" + fileName;

        return VideoChunkInitRespone.builder()
                .uploadId(uploadId)
                .objectName(objectName)
                .fileUrl(objectName)
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
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(chunkObjectKey)
                            .build(),
                    RequestBody.fromInputStream(chunk.getInputStream(), chunk.getSize()));
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

        try {
            // 1. Initiate Multipart Upload
            CreateMultipartUploadResponse createResponse = s3Client.createMultipartUpload(
                    CreateMultipartUploadRequest.builder()
                            .bucket(bucketName)
                            .key(objectName)
                            .build());
            String s3UploadId = createResponse.uploadId();

            List<CompletedPart> completedParts = new ArrayList<>();

            // 2. Copy parts
            for (int i = 1; i <= totalParts; i++) {
                String partKey = chunkObjectKey(uploadId, i);

                UploadPartCopyResponse copyResponse = s3Client.uploadPartCopy(
                        UploadPartCopyRequest.builder()
                                .sourceBucket(bucketName)
                                .sourceKey(partKey)
                                .destinationBucket(bucketName)
                                .destinationKey(objectName)
                                .uploadId(s3UploadId)
                                .partNumber(i)
                                .build());

                completedParts.add(CompletedPart.builder()
                        .partNumber(i)
                        .eTag(copyResponse.copyPartResult().eTag())
                        .build());
            }

            // 3. Complete Multipart Upload
            s3Client.completeMultipartUpload(
                    CompleteMultipartUploadRequest.builder()
                            .bucket(bucketName)
                            .key(objectName)
                            .uploadId(s3UploadId)
                            .multipartUpload(CompletedMultipartUpload.builder()
                                    .parts(completedParts)
                                    .build())
                            .build());

            // 4. Cleanup chunk objects
            for (int i = 1; i <= totalParts; i++) {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(chunkObjectKey(uploadId, i))
                        .build());
            }

            return VideoChunkCompleteResponse.builder()
                    .fileUrl(objectName)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to complete chunked upload", e);
        }
    }

    @Override
    public void abortVideoChunkUpload(String uploadId) {
        String prefix = "multipart/" + uploadId + "/";
        try {
            ListObjectsV2Response listResponse = s3Client.listObjectsV2(
                    ListObjectsV2Request.builder()
                            .bucket(bucketName)
                            .prefix(prefix)
                            .build());

            for (S3Object s3Object : listResponse.contents()) {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(s3Object.key())
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