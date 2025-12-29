package com.reely.modules.feed.service.impl;

import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.dto.ViewStat;
import com.reely.modules.feed.entity.Video;
import com.reely.modules.feed.repository.VideoRepository;

import com.reely.modules.feed.service.VideoService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.reely.modules.auth.dto.PaginationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VideoServiceImpl implements VideoService {
    private final VideoRepository videoRepository;
    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketname;

    public VideoServiceImpl(VideoRepository videoRepository, MinioClient minioClient) {
        this.videoRepository = videoRepository;
        this.minioClient = minioClient;
    }

    @Override
    public Video addVideo(VideoRequestDto videoRequestDto) {
        Video video = new Video(videoRequestDto);
        return videoRepository.save(video);
    }

    @Override
    public String createPresignedUploadUrl(String filename) {
        String objectName = UUID.randomUUID() + "_" + filename;
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(bucketname)
                            .object(objectName)
                            .expiry(600)
                            .build());
        } catch (Exception e) {
            System.out.println("Error creating presigned upload url");
        }
        return null;
    }

    @Override
    public PaginationResponse<Video> getVideosByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videoPage = videoRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return new PaginationResponse<>(videoPage);
    }

    @Override
    public Long getTotalViewsByUserId(Long userId) {
        Long totalViews = videoRepository.getTotalViewsByUserId(userId);
        return totalViews != null ? totalViews : 0L;
    }

    @Override
    public Long getTotalCommentsByUserId(Long userId) {
        Long totalComments = videoRepository.getTotalCommentsByUserId(userId);
        return totalComments != null ? totalComments : 0L;
    }

    @Override
    public Long getTotalLikesByUserId(Long userId) {
        Long totalComments = videoRepository.getTotalLikesByUserId(userId);
        return totalComments != null ? totalComments : 0L;
    }

    @Override
    public List<ViewStat> countViewsByUserIdAndDate(Long userId, Long days) {
        LocalDate startDate = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh")).minusDays(days);
        List<ViewStat> viewStats = videoRepository.getViewsByUserIdAndDate(userId, startDate);

        Map<String, Long> mapData = viewStats.stream().collect(Collectors.toMap(stat -> stat.getDate().toString(), stat -> stat.getCount()));

        List<ViewStat> finalResult = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"))); date = date.plusDays(1)) {
            Long count = mapData.getOrDefault(date.toString(), 0L);
            finalResult.add(new ViewStat(java.sql.Date.valueOf(date), count));
        }
        return finalResult;
    }
}
