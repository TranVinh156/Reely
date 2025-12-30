package com.reely.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;

@Component
public class S3BucketInitializer {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3BucketInitializer(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
            System.out.println("Bucket " + bucketName + " already exists.");
        } catch (NoSuchBucketException e) {
            System.out.println("Bucket " + bucketName + " does not exist. Creating...");
            try {
                s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
                System.out.println("Bucket " + bucketName + " created successfully.");
            } catch (Exception createException) {
                System.err.println("Failed to create bucket: " + createException.getMessage());
            }
        } catch (Exception e) {
            // In some cases (like 403 Forbidden), headBucket might throw a different
            // exception if we don't have permission to list but have permission to create?
            // Or if the bucket exists but we don't have permission.
            // But usually NoSuchBucketException is what we look for.
            // If it's a 404 but wrapped differently, we might need to inspect.
            // For AWS SDK v2, NoSuchBucketException is the standard for 404 on HeadBucket.
            System.err.println("Error checking bucket existence: " + e.getMessage());
        }
    }
}
