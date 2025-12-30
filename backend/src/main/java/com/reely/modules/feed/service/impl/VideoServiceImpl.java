package com.reely.modules.feed.service.impl;

import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.dto.VideoResponseDto;
import com.reely.modules.feed.dto.VideoViewResponseDto;
import com.reely.modules.feed.dto.ViewStat;
import com.reely.modules.feed.entity.Video;
import com.reely.modules.feed.repository.VideoRepository;
import com.reely.modules.interaction.entity.Likes;
import com.reely.modules.interaction.repository.CommentRepository;
import com.reely.modules.interaction.repository.LikeRepository;
import com.reely.modules.feed.service.VideoService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import com.reely.modules.auth.dto.PaginationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;

@Service
public class VideoServiceImpl implements VideoService {
    private final VideoRepository videoRepository;
    private final MinioClient minioClient;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    @Value("${minio.bucket-name}")
    private String bucketname;

    public VideoServiceImpl(VideoRepository videoRepository, MinioClient minioClient, LikeRepository likeRepository,
            CommentRepository commentRepository) {
        this.videoRepository = videoRepository;
        this.minioClient = minioClient;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
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
    public PaginationResponse<Video> getLikedVideosOfUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Likes> likesPage = likeRepository.findAllByUserId(userId, pageable);

        List<Video> videos = likesPage.getContent().stream()
                .map(Likes::getVideo)
                .filter(Objects::nonNull)
                .map(video -> (Video) Hibernate.unproxy(video))
                .collect(Collectors.toList());

        Page<Video> videoPage = new PageImpl<>(videos, pageable, likesPage.getTotalElements());

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

        Map<String, Long> mapData = viewStats.stream()
                .collect(Collectors.toMap(stat -> stat.getDate().toString(), stat -> stat.getCount()));

        List<ViewStat> finalResult = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"))); date = date
                .plusDays(1)) {
            Long count = mapData.getOrDefault(date.toString(), 0L);
            finalResult.add(new ViewStat(java.sql.Date.valueOf(date), count));
        }
        return finalResult;
    }

    @Override
    public List<VideoResponseDto> getTop5ByUserIdOrderByCreatedAtDesc(Long userId) {
        return videoRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(video -> new VideoResponseDto(
                        video.getTitle(),
                        video.getViewCount(),
                        video.getLikeCount(),
                        video.getCommentCount(),
                        video.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VideoViewResponseDto incrementView(Long videoId) {
        if (videoId == null)
            throw new RuntimeException("VideoId is required");
        videoRepository.incrementViewCount(videoId);
        Video v = videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("Video not found"));
        Long vc = v.getViewCount() == null ? 0L : v.getViewCount();
        return new VideoViewResponseDto(videoId, vc);
    }

    @Override
    @Transactional
    public void deleteVideo(Long videoId, Long userId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this video");
        }

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketname)
                            .object(video.getOriginalS3Key().substring(7))
                            .build());
        } catch (Exception e) {
            System.out.println("Error deleting video from MinIO: " + e.getMessage());
        }

        likeRepository.deleteByVideoId(videoId);
        commentRepository.deleteByVideo_Id(videoId);

        videoRepository.delete(video);
    }
}
