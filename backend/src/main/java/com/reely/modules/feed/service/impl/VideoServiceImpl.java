package com.reely.modules.feed.service.impl;


import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.entity.Video;
import com.reely.modules.feed.repository.VideoRepository;
import com.reely.modules.feed.service.VideoService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class VideoServiceImpl implements VideoService {
    private final VideoRepository videoRepository;
    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketname;

    @Autowired
    public VideoServiceImpl(VideoRepository videoRepository, MinioClient minioClient) {
        this.videoRepository = videoRepository;
        this.minioClient = minioClient;
    }

    public Video addVideo(VideoRequestDto videoRequestDto) {
        Video video = new Video(videoRequestDto);
        return videoRepository.save(video);
    }

    public String createPresignedUploadUrl(String filename) {
        String objectName = UUID.randomUUID() + "_" + filename;
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(bucketname)
                            .object(objectName)
                            .expiry(600)
                            .build()
            );
        } catch (Exception e) {
            System.out.println("Error creating presigned upload url");
        }

        return null;
    }

}
