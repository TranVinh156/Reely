package com.reely.modules.feed.service.impl;

import com.reely.modules.feed.dto.VideoRequestDto;
import com.reely.modules.feed.dto.VideoResponseDto;
import com.reely.modules.feed.dto.VideoViewResponseDto;
import com.reely.modules.feed.dto.ViewStat;
import com.reely.modules.feed.entity.Tag;
import com.reely.modules.feed.entity.Video;
import com.reely.modules.feed.repository.TagRepository;
import com.reely.modules.feed.repository.VideoRepository;
import com.reely.modules.interaction.entity.Likes;
import com.reely.modules.interaction.repository.CommentRepository;
import com.reely.modules.interaction.repository.LikeRepository;
import com.reely.modules.feed.service.VideoService;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
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

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;

@Service
public class VideoServiceImpl implements VideoService {
    private final VideoRepository videoRepository;
    private final TagRepository tagRepository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    @Value("${aws.s3.bucket-name}")
    private String bucketname;

    public VideoServiceImpl(VideoRepository videoRepository, TagRepository tagRepository, S3Client s3Client,
            S3Presigner s3Presigner, LikeRepository likeRepository, CommentRepository commentRepository) {
        this.videoRepository = videoRepository;
        this.tagRepository = tagRepository;
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    @Transactional
    public Video addVideo(VideoRequestDto videoRequestDto) {
        if (videoRequestDto == null)
            throw new RuntimeException("Video payload is required");
        Video video = new Video(videoRequestDto);

        Set<Tag> tags = resolveTags(videoRequestDto.getTags());
        video.setTags(tags);

        return videoRepository.save(video);
    }

    private Set<Tag> resolveTags(List<String> requestedNames) {
        if (requestedNames == null || requestedNames.isEmpty())
            return new HashSet<>();

        // normalize: trim, drop leading '#', skip blanks, keep order-agnostic
        // uniqueness
        List<String> normalized = requestedNames.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(s -> s.startsWith("#") ? s.substring(1).trim() : s)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();

        if (normalized.isEmpty())
            return new HashSet<>();

        List<Tag> existing = tagRepository.findByNameIn(normalized);
        Map<String, Tag> byName = new HashMap<>();
        for (Tag t : existing) {
            if (t != null && t.getName() != null)
                byName.put(t.getName(), t);
        }

        List<Tag> toCreate = new ArrayList<>();
        for (String name : normalized) {
            if (!byName.containsKey(name)) {
                toCreate.add(Tag.builder().name(name).build());
            }
        }

        if (!toCreate.isEmpty()) {
            List<Tag> created = tagRepository.saveAll(toCreate);
            for (Tag t : created) {
                if (t != null && t.getName() != null)
                    byName.put(t.getName(), t);
            }
        }

        return new HashSet<>(byName.values());
    }

    @Override
    public String createPresignedUploadUrl(String filename) {
        String objectName = "videos/" + UUID.randomUUID() + "_" + filename;
        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketname)
                    .key(objectName)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(10))
                    .putObjectRequest(objectRequest)
                    .build();

            return s3Presigner.presignPutObject(presignRequest).url().toString();
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
                        video.getId(),
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
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketname)
                    .key(video.getOriginalS3Key().substring(7))
                    .build());
        } catch (Exception e) {
            System.out.println("Error deleting video from S3: " + e.getMessage());
        }

        likeRepository.deleteByVideoId(videoId);
        commentRepository.deleteByVideo_Id(videoId);

        videoRepository.delete(video);
    }
}
