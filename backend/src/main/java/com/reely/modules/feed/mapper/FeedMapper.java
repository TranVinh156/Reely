package com.reely.modules.feed.mapper;

import org.mapstruct.*;

import com.reely.modules.feed.dto.*;
import com.reely.modules.feed.entity.*;
import com.reely.modules.user.entity.User;

@Mapper(componentModel = "spring")
public interface FeedMapper {
    @Mapping(target = "videoId", source = "video.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "avatarUrl", source = "user.avatarUrl")
    @Mapping(target = "videoUrl", expression = "java(buildVideoUrl(video.getOriginalS3Key()))")
    @Mapping(target = "likeCount", source = "video.likeCount")
    @Mapping(target = "commentCount", source = "video.commentCount")
    @Mapping(target = "thumbnailUrl", ignore = true)
    @Mapping(target = "durationSeconds", source = "video.durationSeconds")
        @Mapping(
            target = "tags",
            expression = "java(video.getTags() == null ? java.util.List.of() : video.getTags().stream().map(com.reely.modules.feed.entity.Tag::getName).toList())")
    @Mapping(target = "createdAt", source = "video.createdAt")
    @Mapping(target = "isFollowed", ignore = true)
    @Mapping(target = "isLiked", ignore = true)
    FeedVideoDTO toFeedVideoDTO(Video video, User user);

    default String buildVideoUrl(String s3Key) {
        return s3Key;
    }
}