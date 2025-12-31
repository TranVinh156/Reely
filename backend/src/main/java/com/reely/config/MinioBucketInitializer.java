package com.reely.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.SetBucketPolicyArgs;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class MinioBucketInitializer {

    private final MinioClient minioClient;

    public MinioBucketInitializer(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @PostConstruct
    public void init() {
        createBucket("avatars");
        createBucket("videos");
    }

    private void createBucket(String bucketName) {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build());

            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucketName)
                                .build());

                String policy = """
                        {
                          "Version": "2012-10-17",
                          "Statement": [
                            {
                              "Effect": "Allow",
                              "Principal": {"AWS": ["*"]},
                              "Action": ["s3:GetObject"],
                              "Resource": ["arn:aws:s3:::%s/*"]
                            }
                          ]
                        }
                        """.formatted(bucketName);

                minioClient.setBucketPolicy(
                        SetBucketPolicyArgs.builder()
                                .bucket(bucketName)
                                .config(policy)
                                .build());

                System.out.println("Bucket '" + bucketName + "' created successfully!");
            } else {
                System.out.println("Bucket '" + bucketName + "' already exists.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error initializing MinIO bucket: " + bucketName, e);
        }
    }
}
