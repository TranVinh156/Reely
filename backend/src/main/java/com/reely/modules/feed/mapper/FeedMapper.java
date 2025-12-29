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
    @Mapping(target = "thumbnailUrl", ignore = true)
    @Mapping(target = "durationSeconds", source = "video.durationSeconds")
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "createdAt", source = "video.createdAt")
    @Mapping(target = "isFollowed", ignore = true)
    @Mapping(target = "isLiked", ignore = true)
    FeedVideoDTO toFeedVideoDTO(Video video, User user);

    default String buildVideoUrl(String s3Key) {
        return s3Key;
    }
}